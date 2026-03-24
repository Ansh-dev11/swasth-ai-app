"""
Authentication middleware for FastAPI
"""
import jwt
import os
from typing import Optional
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Header
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY = os.getenv("JWT_EXPIRY", "7d")


def extract_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    """Extract and return the token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    return parts[1]


async def verify_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    Verify JWT token from request header
    
    Args:
        authorization: Authorization header (Bearer token)
    
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = extract_token_from_header(authorization)
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def create_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT token
    
    Args:
        data: Token payload
        expires_delta: Optional expiration time
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Parse JWT_EXPIRY (e.g., "7d")
        days = int(JWT_EXPIRY.replace("d", ""))
        expire = datetime.utcnow() + timedelta(days=days)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt
