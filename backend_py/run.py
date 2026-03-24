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
    
    # Run the app
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        reload_dirs=["app"]
    )
