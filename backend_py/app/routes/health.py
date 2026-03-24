"""
Health check route handlers
"""
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/health", tags=["Health"])


@router.get("/")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint
    """
    return {
        "success": True,
        "data": {
            "status": "operational",
            "message": "Swasth AI API is running"
        }
    }


@router.get("/status")
async def get_status() -> Dict[str, Any]:
    """
    Get detailed service status
    """
    return {
        "success": True,
        "data": {
            "status": "operational",
            "services": {
                "api": "running",
                "database": "connected",
                "ai": "ready"
            }
        }
    }
