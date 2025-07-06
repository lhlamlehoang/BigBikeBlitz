import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application settings
    app_name: str = "BigBikeBlitz AI Agent"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Ollama settings
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "mistral:7b"
    ollama_timeout: int = 30
    
    # Knowledge base settings
    knowledge_base_path: str = "./knowledge_base"
    max_search_results: int = 5
    
    # Database settings
    database_path: str = "./ai_agent.db"
    
    # Website scraping settings
    website_base_url: str = "http://localhost:5173"
    backend_api_url: str = "http://localhost:8080"
    scraping_timeout: int = 10
    max_concurrent_scrapes: int = 5
    
    # Chat settings
    max_conversation_history: int = 20
    session_timeout_hours: int = 24
    
    # CORS settings
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://bigbikeblitz.com"
    ]
    
    # Logging settings
    log_level: str = "INFO"
    log_file: Optional[str] = None
    
    # Security settings
    api_key_header: str = "X-API-Key"
    api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create global settings instance
settings = Settings() 