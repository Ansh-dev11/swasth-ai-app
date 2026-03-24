#!/bin/bash
# Swasth AI - Run Frontend and Backend Together (macOS/Linux)

echo ""
echo "============================================"
echo "  Starting Swasth AI Development Servers"
echo "============================================"
echo ""

echo "Starting Backend Server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

sleep 2

echo "Starting Frontend Server on port 3000..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  Servers Started:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:5000"
echo "============================================"
echo ""
echo "To stop both servers, press Ctrl+C"
echo ""

# Keep script running
wait
