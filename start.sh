#!/bin/bash

echo "🏍️  Big Bike Blitz - Starting Up!"
echo "=================================="
echo ""
echo "🚀 Building and starting all services..."
echo "   This may take a few minutes on first run."
echo ""
echo "📋 What's being set up:"
echo "   • MySQL Database (Port 3306)"
echo "   • Spring Boot Backend (Port 8080)"
echo "   • React Frontend (Port 80)"
echo "   • AI Agent with Demo Mode (Port 8000)"
echo ""
echo "🎯 Once complete, access at:"
echo "   • Frontend: http://localhost"
echo "   • Backend API: http://localhost:8080"
echo "   • AI Agent: http://localhost:8000"
echo "   • AI Health: http://localhost:8000/api/health"
echo ""
echo "⏳ Starting Docker Compose..."

# Run docker-compose with build
docker-compose up --build 