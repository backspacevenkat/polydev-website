#!/bin/bash

echo "🚀 Starting Multi-LLM Orchestration Platform..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "📋 Installing dependencies..."
pip install -r requirements.txt

# Start backend server
echo "🔥 Starting backend server on http://localhost:8000..."
python backend/main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Open dashboard in browser
if command -v open > /dev/null; then
    echo "🌐 Opening dashboard in browser..."
    open http://localhost:8000
elif command -v xdg-open > /dev/null; then
    echo "🌐 Opening dashboard in browser..."
    xdg-open http://localhost:8000
else
    echo "🌐 Dashboard available at: http://localhost:8000"
fi

echo "✅ Multi-LLM Platform is running!"
echo ""
echo "📊 Dashboard: http://localhost:8000"
echo "🔌 API Docs: http://localhost:8000/docs"
echo "🛑 Press Ctrl+C to stop"

# Wait for interrupt
trap 'echo "🛑 Shutting down..."; kill $BACKEND_PID; exit' INT
wait