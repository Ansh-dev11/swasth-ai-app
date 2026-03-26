#!/usr/bin/env python
"""
Startup script for Swasth AI Backend
Run with: python run.py
"""
import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure we're in the right directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    sys.path.insert(0, backend_dir)
    
    port = int(os.getenv("PORT", "5000"))
    reload_enabled = os.getenv("RELOAD", "false").lower() == "true"

    # Run the app (Render provides PORT at runtime)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=reload_enabled,
        reload_dirs=["app"] if reload_enabled else None
    )
