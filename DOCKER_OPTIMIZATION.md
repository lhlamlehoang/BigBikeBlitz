# Docker Optimization for BigBikeBlitz AI Agent

## 🎯 Problem Solved
The original Docker setup was consuming ~20GB of disk space due to heavy ML libraries that weren't actually being used.

## 🚀 Optimizations Applied

### 1. Multi-Stage Build
- **Builder stage**: Installs dependencies and builds the application
- **Production stage**: Only copies the virtual environment and runtime files
- **Result**: Significantly smaller final image

### 2. Removed Unused Dependencies
Removed these heavy libraries that weren't being used:
- `torch` (~2.5GB)
- `transformers` (~1.5GB)
- `scikit-learn` (~500MB)
- `pandas` (~300MB)
- `numpy` (~200MB)
- `selenium` (~500MB)
- `webdriver-manager` (~100MB)
- `celery` (~200MB)

### 3. Optimized Requirements
- Created `requirements-optimized.txt` with only essential dependencies
- Kept only the libraries actually used in the codebase

### 4. Docker Optimizations
- Added `.dockerignore` to exclude unnecessary files
- Used `--no-cache-dir` for pip installations
- Added `PYTHONDONTWRITEBYTECODE=1` to prevent .pyc files
- Cleaned up apt cache and removed unnecessary packages

## 📁 Files Modified/Created

1. **`Dockerfile.ai_agent`** - Optimized multi-stage build
2. **`ai_agent/requirements-optimized.txt`** - Lightweight dependencies
3. **`ai_agent/.dockerignore`** - Excludes unnecessary files
4. **`cleanup-docker.sh`** - Linux/Mac cleanup script
5. **`cleanup-docker.bat`** - Windows cleanup script

## 🛠️ How to Use

### Step 1: Clean Up Existing Docker Data
```bash
# On Linux/Mac:
./cleanup-docker.sh

# On Windows:
cleanup-docker.bat
```

### Step 2: Rebuild with Optimized Image
```bash
docker compose up --build
```

### Step 3: Verify the AI Agent Works
The AI agent should start normally with all functionality intact:
- WebSocket chat endpoint
- REST API endpoints
- Knowledge base integration
- Ollama integration

## 📊 Expected Results

- **Before**: ~20GB disk usage
- **After**: ~2-3GB disk usage (85% reduction)
- **Build time**: Faster due to smaller dependencies
- **Functionality**: Identical to original

## 🔍 What's Still Included

Essential dependencies that are actually used:
- FastAPI and Uvicorn for web server
- WebSocket support
- HTTP requests and data handling
- AI/LLM libraries (Ollama, OpenAI, Anthropic)
- Vector database (ChromaDB, FAISS)
- Database connectors (PostgreSQL, MongoDB, Redis)
- Web scraping (BeautifulSoup4)
- LangChain for AI workflows

## 🚨 Troubleshooting

If you encounter issues:

1. **Check if all dependencies are available**:
   ```bash
   docker compose logs ai_agent
   ```

2. **Verify the AI agent starts**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **If you need additional dependencies**, add them to `requirements-optimized.txt`

## 💡 Additional Tips

1. **Regular cleanup**: Run the cleanup scripts periodically
2. **Monitor disk usage**: Use `docker system df` to check space
3. **Use specific versions**: All dependencies are pinned to specific versions for stability

## 🔄 Reverting Changes

If you need to revert to the original setup:
1. Restore the original `Dockerfile.ai_agent`
2. Use the original `requirements.txt`
3. Remove the `.dockerignore` file 