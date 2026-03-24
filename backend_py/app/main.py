"""
Main FastAPI application for Swasth AI backend
"""
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import ai, auth, health, medicine, report

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)

# Initialize FastAPI app
app = FastAPI(
    title="Swasth AI Health Platform API",
    description="AI-powered health management and analysis API",
    version="1.0.0"
)

# Configure CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
FRONTEND_URL_ALT = os.getenv("FRONTEND_URL_ALT", "http://localhost:3001")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, FRONTEND_URL_ALT, "http://localhost:*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(ai.router)
app.include_router(auth.router)
app.include_router(medicine.router)
app.include_router(report.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Swasth AI Backend API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "ai": "/api/ai",
            "auth": "/api/auth",
            "medicines": "/api/medicines",
            "reports": "/api/reports"
        }
    }


if __name__ == "__main__":
    import uvicorn
    
    PORT = int(os.getenv("PORT", 5000))
    NODE_ENV = os.getenv("NODE_ENV", "development")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=PORT,
        reload=(NODE_ENV == "development"),
        log_level="info"
    )
