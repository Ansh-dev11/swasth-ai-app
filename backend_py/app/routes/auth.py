"""
Authentication route handlers
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.middleware.auth import create_token
from app.services import supabase_service

router = APIRouter(prefix="/api/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


@router.post("/login")
async def login(request: LoginRequest) -> dict:
    """
    Login user and return JWT token
    """
    try:
        db = supabase_service.get_supabase()
        
        if db is None:
            # Fallback: Accept any valid email/password combo without Supabase
            if not request.email or not request.password or len(request.password) < 6:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email and password (min 6 chars) required"
                )
            
            user_id = f"user_{hash(request.email) % 10000000}"
            token = create_token({"id": user_id, "email": request.email})
            
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user_id,
                    "email": request.email,
                    "name": request.email.split("@")[0]
                }
            }
        
        # Authenticate with Supabase
        response = db.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        user = response.user
        token = create_token({"id": user.id, "email": user.email})
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/demo-login")
async def demo_login(request: LoginRequest) -> dict:
    """
    Demo login endpoint - returns JWT token for any valid email/password
    Useful for testing without Supabase setup
    """
    try:
        if not request.email or not request.password or len(request.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password (min 6 chars) required"
            )
        
        # Generate JWT token for demo
        user_id = f"user_{hash(request.email) % 10000000}"
        token = create_token({"id": user_id, "email": request.email})
        
        return {
            "success": True,
            "data": {
                "token": token,
                "user": {
                    "id": user_id,
                    "email": request.email,
                    "name": request.email.split("@")[0]
                }
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.post("/register")
async def register(request: RegisterRequest) -> dict:
    """
    Register new user
    """
    try:
        if not request.email or not request.password or len(request.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password (min 6 chars) required"
            )
        
        db = supabase_service.get_supabase()
        
        if db is None:
            # Fallback: Create user locally without Supabase
            user_id = f"user_{hash(request.email) % 10000000}"
            token = create_token({"id": user_id, "email": request.email})
            
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user_id,
                    "email": request.email,
                    "name": request.full_name or request.email.split("@")[0]
                }
            }
        
        # Sign up with Supabase
        response = db.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        user = response.user
        
        # Create user profile
        try:
            await supabase_service.save_user_profile(
                user_id=user.id,
                email=user.email,
                full_name=request.full_name
            )
        except Exception as profile_error:
            print(f"Note: Could not save profile: {profile_error}")
        
        token = create_token({"id": user.id, "email": user.email})
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": request.full_name or user.email.split("@")[0]
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        print(f"Registration error: {error}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(error)}"
        )


@router.post("/logout")
async def logout() -> dict:
    """
    Logout user (client-side token elimination)
    """
    return {
        "success": True,
        "data": {
            "message": "Logged out successfully"
        }
    }
