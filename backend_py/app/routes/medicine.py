"""
Medicine route handlers
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from typing import Dict, Any, Optional, List
from app.middleware.auth import verify_token
from app.services import ai_service, supabase_service, vision_service
from app.utils.helpers import generate_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])


class VerifyMedicineRequest(BaseModel):
    batch_number: str
    medicine_id: str


class AddMedicineRequest(BaseModel):
    medicine_id: str
    dosage: str
    frequency: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
async def get_medicines(
    query: Optional[str] = Query(None),
    limit: int = Query(50)
) -> Dict[str, Any]:
    """
    Search for medicines
    """
    try:
        medicines = await supabase_service.get_medicines(query, limit)
        return {
            "success": True,
            "data": medicines,
            "count": len(medicines)
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/{medicine_id}")
async def get_medicine_details(medicine_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a medicine
    """
    try:
        medicine = await supabase_service.get_medicine(medicine_id)
        
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        
        # Get AI-enhanced information
        enhanced_info = medicine.copy()
        try:
            ai_info = await ai_service.verify_medicine_info(
                medicine.get("name"),
                medicine.get("dosage")
            )
            enhanced_info.update(ai_info)
        except Exception as ai_error:
            print(f"AI enhancement error: {str(ai_error)}")
            # Return basic info if AI fails
        
        return {
            "success": True,
            "data": enhanced_info
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/verify")
async def verify_medicine(
    request: VerifyMedicineRequest,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Verify medicine batch number
    """
    try:
        user_id = user.get("id")
        
        if not request.batch_number or not request.medicine_id:
            raise HTTPException(
                status_code=400,
                detail="Batch number and medicine ID are required"
            )
        
        # Get medicine details
        medicine = await supabase_service.get_medicine(request.medicine_id)
        
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        
        # Check if batch is valid
        is_valid = medicine.get("batch_number") == request.batch_number
        
        # Save verification record
        verification = await supabase_service.save_verification(
            user_id,
            request.medicine_id,
            request.batch_number,
            is_valid
        )
        
        return {
            "success": True,
            "data": {
                "verified": is_valid,
                "medicine": {
                    "id": medicine.get("id"),
                    "name": medicine.get("name"),
                    "brand": medicine.get("brand"),
                    "description": medicine.get("description")
                },
                "verification_id": verification.get("id")
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/add")
async def add_medicine_to_profile(
    request: AddMedicineRequest,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Add medicine to user profile
    """
    try:
        user_id = user.get("id")
        
        if not request.medicine_id or not request.dosage or not request.frequency:
            raise HTTPException(
                status_code=400,
                detail="Medicine ID, dosage, and frequency are required"
            )
        
        db = supabase_service.get_supabase_admin()
        prescription_id = generate_id()
        
        response = db.table("user_medicines").insert({
            "id": prescription_id,
            "user_id": user_id,
            "medicine_id": request.medicine_id,
            "dosage": request.dosage,
            "frequency": request.frequency,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "notes": request.notes
        }).execute()
        
        prescription = response.data[0] if response.data else {}
        
        return {
            "success": True,
            "data": {
                "message": "Medicine added successfully",
                "prescription_id": prescription.get("id")
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/user/medicines")
async def get_user_medicines(
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Get all medicines for current user
    """
    try:
        user_id = user.get("id")
        medicines = await supabase_service.get_user_medicines(user_id)
        
        return {
            "success": True,
            "data": medicines,
            "count": len(medicines)
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/analyze")
async def analyze_medicine_package(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Analyze medicine package image using Gemini Vision API
    
    Extracts:
    - medicine_name, dosage, batch_number, expiry_date, manufacturing_date, manufacturer_name
    
    Validates:
    - spelling_errors, packaging_damage, suspicious_print_quality
    
    Returns strict JSON with null for unclear fields
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read file content
        content = await file.read()
        
        if not content:
            raise HTTPException(
                status_code=400,
                detail="File is empty"
            )
        
        # Analyze the medicine package using AI (no database needed)
        analysis_result = vision_service.analyze_medicine_package(content)
        
        if "error" in analysis_result:
            return {
                "success": False,
                "error": analysis_result.get("error"),
                "data": analysis_result
            }
        
        # Return analysis directly without database
        return {
            "success": True,
            "data": {
                "analysis_id": f"analysis_{int(__import__('time').time())}",
                "analysis": analysis_result
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
