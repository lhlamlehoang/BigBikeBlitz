import asyncio
import logging
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import chromadb
from chromadb.config import Settings
import hashlib

logger = logging.getLogger(__name__)

class KnowledgeBase:
    def __init__(self, persist_directory: str = "./knowledge_base"):
        self.persist_directory = persist_directory
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="bigbikeblitz_knowledge",
            metadata={"description": "BigBikeBlitz website knowledge base"}
        )
        
    async def add_document(self, document: Dict[str, Any]) -> bool:
        """Add a document to the knowledge base"""
        try:
            # Generate document ID
            doc_id = hashlib.md5(f"{document['url']}_{datetime.now().isoformat()}".encode()).hexdigest()
            
            # Prepare document for storage
            content = document.get("content", "")
            metadata = {
                "url": document.get("url", ""),
                "title": document.get("title", ""),
                "type": document.get("metadata", {}).get("type", "page"),
                "scraped_at": datetime.now().isoformat(),
                **document.get("metadata", {})
            }
            
            # Add to collection
            self.collection.add(
                documents=[content],
                metadatas=[metadata],
                ids=[doc_id]
            )
            
            logger.info(f"Added document: {document.get('title', 'Unknown')}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            return False
    
    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search the knowledge base for relevant documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit,
                include=["documents", "metadatas", "distances"]
            )
            
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    documents.append({
                        "content": doc,
                        "metadata": results['metadatas'][0][i],
                        "distance": results['distances'][0][i] if results['distances'] else None
                    })
            
            return documents
            
        except Exception as e:
            logger.error(f"Error searching knowledge base: {e}")
            return []
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        try:
            count = self.collection.count()
            
            # Get sample documents for analysis
            sample_results = self.collection.query(
                query_texts=[""],
                n_results=min(count, 100)
            )
            
            # Analyze document types
            doc_types = {}
            if sample_results['metadatas'] and sample_results['metadatas'][0]:
                for metadata in sample_results['metadatas'][0]:
                    doc_type = metadata.get('type', 'unknown')
                    doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
            
            return {
                "total_documents": count,
                "document_types": doc_types,
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting knowledge base stats: {e}")
            return {"error": str(e)}
    
    async def has_data(self) -> bool:
        """Check if knowledge base has any data"""
        try:
            count = self.collection.count()
            return count > 0
        except Exception as e:
            logger.error(f"Error checking knowledge base data: {e}")
            return False
    
    async def get_document_count(self) -> int:
        """Get the number of documents in the knowledge base"""
        try:
            return self.collection.count()
        except Exception as e:
            logger.error(f"Error getting document count: {e}")
            return 0
    
    async def load_knowledge_base(self) -> bool:
        """Load existing knowledge base data"""
        try:
            count = await self.get_document_count()
            logger.info(f"Loaded knowledge base with {count} documents")
            return True
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            return False
    
    async def clear_knowledge_base(self) -> bool:
        """Clear all documents from the knowledge base"""
        try:
            self.collection.delete(where={})
            logger.info("Knowledge base cleared")
            return True
        except Exception as e:
            logger.error(f"Error clearing knowledge base: {e}")
            return False
    
    async def update_document(self, url: str, new_content: Dict[str, Any]) -> bool:
        """Update an existing document"""
        try:
            # Find existing document
            results = self.collection.query(
                query_texts=[""],
                where={"url": url},
                n_results=1
            )
            
            if results['ids'] and results['ids'][0]:
                doc_id = results['ids'][0][0]
                
                # Update document
                self.collection.update(
                    ids=[doc_id],
                    documents=[new_content.get("content", "")],
                    metadatas=[{
                        "url": new_content.get("url", url),
                        "title": new_content.get("title", ""),
                        "type": new_content.get("metadata", {}).get("type", "page"),
                        "updated_at": datetime.now().isoformat(),
                        **new_content.get("metadata", {})
                    }]
                )
                
                logger.info(f"Updated document: {url}")
                return True
            else:
                # Document not found, add new one
                return await self.add_document(new_content)
                
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            return False
    
    async def get_documents_by_type(self, doc_type: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get documents by type"""
        try:
            results = self.collection.query(
                query_texts=[""],
                where={"type": doc_type},
                n_results=limit
            )
            
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    documents.append({
                        "content": doc,
                        "metadata": results['metadatas'][0][i],
                        "id": results['ids'][0][i]
                    })
            
            return documents
            
        except Exception as e:
            logger.error(f"Error getting documents by type: {e}")
            return [] 