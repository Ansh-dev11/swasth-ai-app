"""
AI route handlers for health questions, insights, and predictions
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Dict, Any, Optional
from app.middleware.auth import verify_token
from app.services import ai_service, supabase_service
from app.utils.helpers import generate_id, format_response, format_error
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["AI"])


class AskQuestionRequest(BaseModel):
    question: str
    category: Optional[str] = "general"


class HealthInsightsRequest(BaseModel):
    pass


class HealthPlanRequest(BaseModel):
    goals: str


class MedicineInteractionRequest(BaseModel):
    medicine_ids: list[str]


@router.post("/ask")
async def ask_question(
    request: AskQuestionRequest,
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Ask a health question and get AI response
    """
    try:
        user_id = None
        user_profile = None

        # Optional auth: if token is present and valid, enrich with user context.
        if authorization:
            try:
                user = await verify_token(authorization)
                user_id = user.get("id")
                if user_id:
                    user_profile = await supabase_service.get_user_profile(user_id)
            except Exception:
                # Fall back to guest mode if token is invalid.
                user_id = None
                user_profile = None

        # Get AI response (works for both guest and authenticated users)
        ai_response = await ai_service.ask_health_question(
            request.question,
            {
                "medical_history": user_profile.get("medical_conditions", "") if user_profile else "",
                "recent_health_data": user_profile.get("blood_type", "") if user_profile else ""
            }
        )

        # Persist history only for authenticated users.
        query_id = None
        if user_id:
            query = await supabase_service.save_query(user_id, request.question, request.category)
            query_id = query.get("id")
            await supabase_service.save_response(
                query_id,
                user_id,
                ai_response.get("answer", ""),
                ai_response.get("sources", []),
                ai_response.get("confidence", 0)
            )

        return format_response({
            "query_id": query_id,
            "question": request.question,
            "answer": ai_response.get("answer", ""),
            "sources": ai_response.get("sources", []),
            "confidence": ai_response.get("confidence", 0)
        }, "Question answered successfully")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/conversation")
async def get_conversation(
    limit: int = 50,
    offset: int = 0,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Get conversation history for user
    """
    try:
        user_id = user.get("id")
        db = supabase_service.get_supabase_admin()
        
        response = db.table("ai_queries").select(
            """*,
            ai_responses(id, answer, sources, confidence, created_at)"""
        ).eq("user_id", user_id).order(
            "created_at", desc=True
        ).range(offset, offset + limit - 1).execute()
        
        return format_response(response.data or [], "Conversation history retrieved")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/insights")
async def get_health_insights(
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Generate health insights for user
    """
    try:
        user_id = user.get("id")
        
        # Get user profile
        user_profile = await supabase_service.get_user_profile(user_id)
        
        # Get recent health data (last 30 days)
        health_data = await supabase_service.get_health_data(user_id, days_back=30)
        
        # Generate AI insights
        insights = await ai_service.generate_health_insights(health_data, user_profile or {})
        
        return format_response(insights, "Health insights generated successfully")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/predict-risks")
async def predict_health_risks() -> Dict[str, Any]:
    """
    Predict health risks based on simulated health data using AI
    """
    try:
        # Simulated health data for 6-month period
        simulated_health_data = [
            {"date": "2025-10-01", "bp": 118, "sugar": 92, "weight": 74},
            {"date": "2025-11-01", "bp": 122, "sugar": 96, "weight": 73.5},
            {"date": "2025-12-01", "bp": 119, "sugar": 94, "weight": 73},
            {"date": "2026-01-01", "bp": 125, "sugar": 100, "weight": 74.2},
            {"date": "2026-02-01", "bp": 128, "sugar": 105, "weight": 74.8},
            {"date": "2026-03-01", "bp": 124, "sugar": 98, "weight": 73.8},
        ]
        
        # Use AI to predict health risks
        prediction = await ai_service.predict_health_risks(
            simulated_health_data,
            medical_history="No significant medical history"
        )
        
        return format_response(prediction, "Health risks predicted successfully")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/health-plan")
async def generate_health_plan(
    request: HealthPlanRequest,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Generate personalized health plan
    """
    try:
        user_id = user.get("id")
        
        if not request.goals:
            raise HTTPException(status_code=400, detail="Health goals are required")
        
        # Get user profile and health data
        user_profile = await supabase_service.get_user_profile(user_id)
        health_data = await supabase_service.get_health_data(user_id, days_back=30)
        
        # Generate plan
        plan = await ai_service.generate_health_plan(
            user_profile or {},
            health_data,
            request.goals
        )
        
        # Save plan
        db = supabase_service.get_supabase_admin()
        plan_id = generate_id()
        db.table("ai_responses").insert({
            "id": plan_id,
            "query_id": None,
            "user_id": user_id,
            "answer": str(plan),
            "sources": ["AI Health Planner"],
            "confidence": 0.9
        }).execute()
        
        return format_response(
            {"plan_id": plan_id, **plan},
            "Health plan generated successfully"
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/medicine-interactions")
async def analyze_medicine_interactions(
    request: MedicineInteractionRequest,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Analyze interactions between medicines
    """
    try:
        user_id = user.get("id")
        
        if not request.medicine_ids:
            raise HTTPException(status_code=400, detail="Medicine IDs are required")
        
        # Get medicine details
        db = supabase_service.get_supabase_admin()
        medicines_response = db.table("medicines").select("*").in_(
            "id", request.medicine_ids
        ).execute()
        
        medicines = medicines_response.data or []
        
        if not medicines:
            raise HTTPException(status_code=404, detail="Medicines not found")
        
        # Get AI analysis
        medicine_names = ", ".join([m.get("name") for m in medicines])
        prompt = f"""Analyze potential interactions between: {medicine_names}. 
        Provide: interactions found, severity level, recommendations, and whether to consult doctor.
        Format as JSON."""
        
        ai_response = await ai_service.ask_health_question(prompt)
        
        return format_response({
            "medicines": [{"id": m.get("id"), "name": m.get("name")} for m in medicines],
            "analysis": ai_response["answer"],
            "sources": ai_response["sources"],
            "confidence": ai_response["confidence"]
        }, "Medicine interactions analyzed successfully")
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
