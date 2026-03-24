"""
Supabase database service module
"""
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize clients - gracefully handle missing configuration for testing
supabase_client: Optional[Client] = None
supabase_admin: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY and not SUPABASE_URL.startswith("https://your"):
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        if SUPABASE_SERVICE_KEY and not SUPABASE_SERVICE_KEY.startswith("your"):
            supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    except Exception as e:
        print(f"Warning: Could not initialize Supabase: {str(e)}")
else:
    print("Warning: Supabase not configured. Database operations will be disabled.")


def get_supabase() -> Optional[Client]:
    """Get Supabase client"""
    return supabase_client


def get_supabase_admin() -> Optional[Client]:
    """Get Supabase admin client"""
    return supabase_admin


async def save_query(
    user_id: str,
    question: str,
    category: str = "general"
) -> Dict[str, Any]:
    """Save AI query to database"""
    if not supabase_admin:
        return {"id": f"{user_id}_{datetime.now().timestamp()}", "status": "mock"}
    
    query_id = f"{user_id}_{datetime.now().timestamp()}"
    try:
        response = supabase_admin.table("ai_queries").insert({
            "id": query_id,
            "user_id": user_id,
            "question": question,
            "category": category,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"Error saving query: {e}")
        return {"id": query_id, "status": "error"}


async def save_response(
    query_id: str,
    user_id: str,
    answer: str,
    sources: List[str],
    confidence: float
) -> Dict[str, Any]:
    """Save AI response to database"""
    response_id = f"{user_id}_{datetime.now().timestamp()}"
    response = supabase_admin.table("ai_responses").insert({
        "id": response_id,
        "query_id": query_id,
        "user_id": user_id,
        "answer": answer,
        "sources": sources,
        "confidence": confidence,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    return response.data[0] if response.data else {}


async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Fetch user profile from database"""
    response = supabase_admin.table("users").select("*").eq("id", user_id).single().execute()
    return response.data


async def get_health_data(
    user_id: str,
    days_back: int = 30
) -> List[Dict[str, Any]]:
    """Fetch recent health data for user"""
    from_date = datetime.fromtimestamp(
        datetime.now().timestamp() - (days_back * 24 * 60 * 60)
    ).isoformat()
    
    response = supabase_admin.table("health_data").select(
        "type, value, date"
    ).eq("user_id", user_id).gte("date", from_date).order(
        "date", desc=True
    ).execute()
    
    return response.data or []


async def get_all_health_data(user_id: str) -> List[Dict[str, Any]]:
    """Fetch all health data for a user."""
    if not supabase_admin:
        return []
    
    response = supabase_admin.table("health_data").select(
        "type, value, date, notes"
    ).eq("user_id", user_id).order("date", desc=True).execute()
    
    return response.data or []


async def save_report(
    user_id: str,
    title: str,
    report_type: str,
    findings: Dict[str, Any],
    file_url: Optional[str] = None,
    date: Optional[str] = None
) -> Dict[str, Any]:
    """Save medical report to database"""
    report_id = f"{user_id}_{datetime.now().timestamp()}"
    
    if not supabase_admin:
        # Return mock report if database not configured
        return {
            "id": report_id,
            "user_id": user_id,
            "title": title,
            "report_type": report_type,
            "findings": findings,
            "file_url": file_url,
            "date": date or datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "status": "mock"
        }
    
    try:
        response = supabase_admin.table("medical_reports").insert({
            "id": report_id,
            "user_id": user_id,
            "title": title,
            "report_type": report_type,
            "findings": findings,
            "file_url": file_url,
            "date": date or datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"Error saving report: {str(e)}")
        # Return mock if database call fails
        return {
            "id": report_id,
            "user_id": user_id,
            "title": title,
            "report_type": report_type,
            "findings": findings,
            "file_url": file_url,
            "date": date or datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }


async def get_reports(
    user_id: str,
    report_type: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Fetch medical reports for user"""
    if not supabase_admin:
        return []
    
    try:
        query = supabase_admin.table("medical_reports").select("*").eq(
            "user_id", user_id
        ).order("created_at", desc=True)
        
        if report_type:
            query = query.eq("report_type", report_type)
        
        response = query.execute()
        return response.data or []
    except Exception as e:
        print(f"Error fetching reports: {str(e)}")
        return []


async def get_medicines(query: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Fetch medicines from database"""
    db_query = supabase_admin.table("medicines").select("*").limit(limit)
    
    if query:
        db_query = db_query.or_(
            f"name.ilike.%{query}%,brand.ilike.%{query}%,batch_number.ilike.%{query}%"
        )
    
    response = db_query.execute()
    return response.data or []


async def get_medicine(medicine_id: str) -> Optional[Dict[str, Any]]:
    """Fetch single medicine by ID"""
    response = supabase_admin.table("medicines").select("*").eq(
        "id", medicine_id
    ).single().execute()
    return response.data


async def get_user_medicines(user_id: str) -> List[Dict[str, Any]]:
    """Fetch medicines for a user"""
    response = supabase_admin.table("user_medicines").select(
        "*, medicines(*)"
    ).eq("user_id", user_id).execute()
    return response.data or []


async def save_verification(
    user_id: str,
    medicine_id: str,
    batch_number: str,
    is_valid: bool
) -> Dict[str, Any]:
    """Save medicine verification record"""
    verification_id = f"{user_id}_{datetime.now().timestamp()}"
    response = supabase_admin.table("medicine_verifications").insert({
        "id": verification_id,
        "user_id": user_id,
        "medicine_id": medicine_id,
        "batch_number": batch_number,
        "is_valid": is_valid,
        "verified_at": datetime.utcnow().isoformat()
    }).execute()
    return response.data[0] if response.data else {}


async def save_user_profile(
    user_id: str,
    email: str,
    full_name: Optional[str] = None
) -> Dict[str, Any]:
    """Save user profile to database"""
    if not supabase_admin:
        # Return mock if database not configured
        return {
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "created_at": datetime.utcnow().isoformat(),
            "status": "mock"
        }
    
    try:
        response = supabase_admin.table("users").insert({
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"Error saving user profile: {str(e)}")
        # Return mock if database call fails
        return {
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "created_at": datetime.utcnow().isoformat()
        }
