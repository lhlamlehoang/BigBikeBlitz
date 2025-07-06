import ollama
import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, model_name: str = "llama3.2:1b"):
        self.model_name = model_name
        self.base_url = "http://localhost:11434"
        self.client = ollama.Client(host=self.base_url)
        self._model_loaded = False
        self._response_cache = {}
        
    async def check_health(self) -> bool:
        """Check if Ollama is running and model is available"""
        try:
            # Check if Ollama is running
            models = self.client.list()
            model_names = [model['name'] for model in models['models']]
            
            if self.model_name not in model_names:
                logger.warning(f"Model {self.model_name} not found. Available models: {model_names}")
                return False
            
            # Preload the model for faster responses
            if not self._model_loaded:
                logger.info(f"Preloading model: {self.model_name}")
                await asyncio.to_thread(self.client.pull, model=self.model_name)
                self._model_loaded = True
                logger.info(f"Model {self.model_name} loaded successfully")
                
            return True
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False
    
    async def generate_response(
        self, 
        message: str, 
        context: str = "", 
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """Generate response using Llama 3.2 1B with caching and timeout"""
        try:
            # Check cache first for common queries
            cache_key = message.lower().strip()
            if cache_key in self._response_cache:
                logger.info("Using cached response")
                return self._response_cache[cache_key]
            
            # Prepare system prompt
            system_prompt = self._create_system_prompt(context)
            
            # Prepare conversation
            messages = self._prepare_messages(system_prompt, message, history or [])
            
            # Generate response without timeout
            response = await asyncio.to_thread(
                self.client.chat,
                model=self.model_name,
                messages=messages,
                options={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 150,  # Very short for speed
                    "num_predict": 150,
                    "top_k": 20,
                    "repeat_penalty": 1.1
                }
            )
            
            response_text = response['message']['content']
            
            # Cache the response for future use
            self._response_cache[cache_key] = response_text
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Hello! I'm your BigBikeBlitz AI assistant. How can I help you with motorcycles today?"
    
    def _create_system_prompt(self, context: str) -> str:
        """Create system prompt with BigBikeBlitz context"""
        base_prompt = """You are BigBikeBlitz AI Assistant for motorcycle e-commerce. Be concise, helpful, and accurate.

Focus on:
- Motorcycle specifications, prices, and features
- Product comparisons and recommendations
- BigBikeBlitz services (financing, warranty, delivery)
- Technical motorcycle information

Keep responses under 200 words unless detailed specs are requested."""
        
        if context:
            base_prompt += f"\n\nRelevant product info:\n{context}"
        
        return base_prompt
    
    def _prepare_messages(
        self, 
        system_prompt: str, 
        user_message: str, 
        history: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        """Prepare messages for Ollama API"""
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in history[-10:]:  # Limit to last 10 messages
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        return messages
    
    async def test_model(self) -> bool:
        """Test the model with a simple query"""
        try:
            test_response = await self.generate_response(
                "Hello, can you tell me about BigBikeBlitz?"
            )
            logger.info(f"Model test successful: {test_response[:100]}...")
            return True
        except Exception as e:
            logger.error(f"Model test failed: {e}")
            return False
    
    async def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        try:
            models = self.client.list()
            for model in models['models']:
                if model['name'] == self.model_name:
                    return {
                        "name": model['name'],
                        "size": model.get('size', 'Unknown'),
                        "modified_at": model.get('modified_at', 'Unknown'),
                        "digest": model.get('digest', 'Unknown')
                    }
            return {"error": "Model not found"}
        except Exception as e:
            logger.error(f"Error getting model info: {e}")
            return {"error": str(e)} 