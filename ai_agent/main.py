from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
import logging
from datetime import datetime
import uuid

from chat_manager import ChatManager
from knowledge_base import KnowledgeBase
from ollama_client import OllamaClient
from website_scraper import WebsiteScraper
from database import DatabaseManager
from product_data import ProductDataSeeder
from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BigBikeBlitz AI Agent",
    description="AI-powered chatbot for BigBikeBlitz motorcycle e-commerce website",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://bigbikeblitz.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
chat_manager = ChatManager()
knowledge_base = KnowledgeBase()
ollama_client = OllamaClient()
website_scraper = WebsiteScraper()
db_manager = DatabaseManager()

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime
    sources: List[Dict[str, Any]] = []

class WebsiteData(BaseModel):
    url: str
    content: str
    metadata: Dict[str, Any]

@app.on_event("startup")
async def startup_event():
    """Initialize the AI agent on startup"""
    logger.info("Starting BigBikeBlitz AI Agent...")
    
    # Initialize database
    await db_manager.initialize()
    
    # Load existing knowledge base
    await knowledge_base.load_knowledge_base()
    
    # Scrape website data if not already available
    if not await knowledge_base.has_data():
        logger.info("Scraping website data...")
        await scrape_website_data()
    
    # Seed product data if not available
    product_docs = await knowledge_base.get_documents_by_type("product", limit=1)
    if not product_docs:
        logger.info("Seeding product data...")
        seeder = ProductDataSeeder()
        await seeder.seed_product_data()
    
    logger.info("AI Agent started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down AI Agent...")
    await db_manager.close()

@app.websocket("/ws/chat/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat"""
    await chat_manager.connect(websocket, session_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process message
            user_message = message_data.get("message", "")
            user_id = message_data.get("user_id")
            
            if user_message.strip():
                # Generate AI response
                response = await generate_ai_response(user_message, session_id, user_id)
                
                # Send response back to client
                await websocket.send_text(json.dumps({
                    "type": "response",
                    "message": response.response,
                    "session_id": session_id,
                    "timestamp": response.timestamp.isoformat(),
                    "sources": response.sources
                }))
                
                # Log conversation
                await db_manager.log_conversation(
                    session_id=session_id,
                    user_id=user_id,
                    user_message=user_message,
                    ai_response=response.response,
                    sources=response.sources
                )
    
    except WebSocketDisconnect:
        chat_manager.disconnect(session_id)
        logger.info(f"WebSocket disconnected for session: {session_id}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """REST API endpoint for chat"""
    try:
        response = await generate_ai_response(
            chat_message.message, 
            chat_message.session_id or str(uuid.uuid4()),
            chat_message.user_id
        )
        return response
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scrape-website")
async def scrape_website_endpoint():
    """Endpoint to trigger website scraping"""
    try:
        await scrape_website_data()
        return {"message": "Website data scraped successfully"}
    except Exception as e:
        logger.error(f"Error scraping website: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/knowledge-base/stats")
async def get_knowledge_base_stats():
    """Get statistics about the knowledge base"""
    try:
        stats = await knowledge_base.get_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting knowledge base stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ollama_status": await ollama_client.check_health(),
        "knowledge_base_size": await knowledge_base.get_document_count()
    }

async def generate_ai_response(message: str, session_id: str, user_id: Optional[str] = None) -> ChatResponse:
    """Generate AI response using Mistral 7B"""
    try:
        # Get conversation history
        history = await chat_manager.get_conversation_history(session_id)
        
        # Search knowledge base for relevant information
        relevant_docs = await knowledge_base.search(message, limit=5)
        
        # Create context from relevant documents
        context = create_context_from_documents(relevant_docs)
        
        # Generate response using Ollama
        ai_response = await ollama_client.generate_response(
            message=message,
            context=context,
            history=history
        )
        
        # Update conversation history
        await chat_manager.add_message(session_id, "user", message)
        await chat_manager.add_message(session_id, "assistant", ai_response)
        
        return ChatResponse(
            response=ai_response,
            session_id=session_id,
            timestamp=datetime.now(),
            sources=[{"title": doc.get("title", ""), "url": doc.get("url", "")} for doc in relevant_docs]
        )
    
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        return ChatResponse(
            response="I apologize, but I'm having trouble processing your request right now. Please try again later.",
            session_id=session_id,
            timestamp=datetime.now()
        )

def create_context_from_documents(documents: List[Dict[str, Any]]) -> str:
    """Create context string from relevant documents"""
    if not documents:
        return ""
    
    context_parts = []
    for doc in documents:
        title = doc.get("title", "")
        content = doc.get("content", "")
        url = doc.get("url", "")
        doc_type = doc.get("metadata", {}).get("type", "page")
        
        if doc_type == "product":
            # For products, include specific details
            brand = doc.get("metadata", {}).get("brand", "")
            model = doc.get("metadata", {}).get("model", "")
            price = doc.get("metadata", {}).get("price", "")
            engine = doc.get("metadata", {}).get("engine_size", "")
            horsepower = doc.get("metadata", {}).get("horsepower", "")
            
            context_parts.append(f"Product: {brand} {model}\nPrice: {price}\nEngine: {engine}\nHorsepower: {horsepower}\nDetails: {content}\n")
        else:
            context_parts.append(f"Title: {title}\nURL: {url}\nContent: {content}\n")
    
    return "\n".join(context_parts)

async def scrape_website_data():
    """Scrape website data and add to knowledge base"""
    try:
        # Scrape main pages
        pages_to_scrape = [
            "http://localhost:5173",  # Frontend dev server
            "http://localhost:5173/categories",
            "http://localhost:5173/about",
            "http://localhost:5173/contact",
            "http://localhost:5173/help"
        ]
        
        for page_url in pages_to_scrape:
            try:
                page_data = await website_scraper.scrape_page(page_url)
                if page_data:
                    await knowledge_base.add_document(page_data)
                    logger.info(f"Scraped: {page_url}")
            except Exception as e:
                logger.warning(f"Failed to scrape {page_url}: {e}")
        
        # Scrape product pages (get from backend API)
        try:
            products = await get_products_from_backend()
            for product in products:
                product_data = {
                    "url": f"http://localhost:5173/product/{product['id']}",
                    "title": f"Product: {product['name']}",
                    "content": f"Brand: {product['brand']}, Type: {product['type']}, Price: ${product['price']}, Description: {product.get('description', '')}",
                    "metadata": {
                        "type": "product",
                        "brand": product['brand'],
                        "category": product['type'],
                        "price": product['price']
                    }
                }
                await knowledge_base.add_document(product_data)
        except Exception as e:
            logger.warning(f"Failed to scrape products: {e}")
        
        logger.info("Website scraping completed")
    
    except Exception as e:
        logger.error(f"Error in website scraping: {e}")
        raise

async def get_products_from_backend() -> List[Dict[str, Any]]:
    """Get products from Spring Boot backend"""
    try:
        import requests
        response = requests.get("http://localhost:8080/api/bikes/all", timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            logger.warning(f"Backend API returned status {response.status_code}")
            return []
    except Exception as e:
        logger.warning(f"Failed to get products from backend: {e}")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 