@echo off
echo 🧹 Docker Cleanup Script for BigBikeBlitz
echo ==========================================

REM Stop and remove containers
echo 📦 Stopping and removing containers...
docker stop $(docker ps -aq) 2>nul
docker rm $(docker ps -aq) 2>nul

REM Remove unused images
echo 🗑️  Removing unused images...
docker image prune -af

REM Remove unused volumes
echo 💾 Removing unused volumes...
docker volume prune -f

REM Remove unused networks
echo 🌐 Removing unused networks...
docker network prune -f

REM Remove build cache
echo 🧱 Removing build cache...
docker builder prune -af

REM Show disk usage
echo 📊 Current Docker disk usage:
docker system df

echo ✅ Cleanup completed!
echo.
echo 💡 To rebuild with optimized image:
echo    docker compose up --build
pause 