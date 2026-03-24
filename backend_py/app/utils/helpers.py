"""
Utility helper functions
"""
import uuid
from datetime import datetime


def generate_id() -> str:
    """Generate unique ID"""
    return str(uuid.uuid4())


def get_timestamp() -> str:
    """Get current UTC timestamp"""
    return datetime.utcnow().isoformat()


def format_response(data: any, message: str = "") -> dict:
    """Format API response"""
    return {
        "success": True,
        "data": data,
        "message": message,
        "timestamp": get_timestamp()
    }


def format_error(error: str, status_code: int = 400) -> dict:
    """Format error response"""
    return {
        "success": False,
        "error": error,
        "status_code": status_code,
        "timestamp": get_timestamp()
    }
