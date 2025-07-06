#!/bin/bash

echo "🧹 Docker Cleanup Script for BigBikeBlitz"
echo "=========================================="

# Stop and remove containers
echo "📦 Stopping and removing containers..."
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Remove unused images
echo "🗑️  Removing unused images..."
docker image prune -af

# Remove unused volumes
echo "💾 Removing unused volumes..."
docker volume prune -f

# Remove unused networks
echo "🌐 Removing unused networks..."
docker network prune -f

# Remove build cache
echo "🧱 Removing build cache..."
docker builder prune -af

# Show disk usage
echo "📊 Current Docker disk usage:"
docker system df

echo "✅ Cleanup completed!"
echo ""
echo "💡 To rebuild with optimized image:"
echo "   docker compose up --build" 