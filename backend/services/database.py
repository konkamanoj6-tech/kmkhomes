from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
from bson import ObjectId
import os

# Database connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'kmk_homes')

client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]

class DatabaseService:
    def __init__(self, collection_name: str):
        self.collection = database[collection_name]
    
    async def create(self, document: dict) -> str:
        """Create a new document."""
        result = await self.collection.insert_one(document)
        return str(result.inserted_id)
    
    async def get_by_id(self, doc_id: str) -> Optional[dict]:
        """Get document by ID."""
        if not ObjectId.is_valid(doc_id):
            return None
        document = await self.collection.find_one({"_id": ObjectId(doc_id)})
        if document:
            document["_id"] = str(document["_id"])
        return document
    
    async def get_all(self, filters: dict = None, sort: list = None, limit: int = None, skip: int = 0) -> List[dict]:
        """Get all documents with optional filters and sorting."""
        query = filters or {}
        cursor = self.collection.find(query)
        
        if sort:
            cursor = cursor.sort(sort)
        
        if skip:
            cursor = cursor.skip(skip)
            
        if limit:
            cursor = cursor.limit(limit)
        
        documents = await cursor.to_list(length=None)
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return documents
    
    async def update_by_id(self, doc_id: str, update_data: dict) -> bool:
        """Update document by ID."""
        if not ObjectId.is_valid(doc_id):
            return False
        
        from datetime import datetime
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(doc_id)}, 
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    async def delete_by_id(self, doc_id: str) -> bool:
        """Delete document by ID."""
        if not ObjectId.is_valid(doc_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(doc_id)})
        return result.deleted_count > 0
    
    async def count_documents(self, filters: dict = None) -> int:
        """Count documents with optional filters."""
        query = filters or {}
        return await self.collection.count_documents(query)
    
    async def get_one(self, filters: dict) -> Optional[dict]:
        """Get single document by filters."""
        document = await self.collection.find_one(filters)
        if document:
            document["_id"] = str(document["_id"])
        return document

# Service instances
properties_db = DatabaseService('properties')
home_banners_db = DatabaseService('home_banners')
about_sections_db = DatabaseService('about_sections')
team_members_db = DatabaseService('team_members')
amenities_db = DatabaseService('amenities')
upcoming_projects_db = DatabaseService('upcoming_projects')
testimonials_db = DatabaseService('testimonials')
news_events_db = DatabaseService('news_events')
nri_content_db = DatabaseService('nri_content')
contact_info_db = DatabaseService('contact_info')
site_settings_db = DatabaseService('site_settings')
admin_users_db = DatabaseService('admin_users')
contact_submissions_db = DatabaseService('contact_submissions')
budget_homes_db = DatabaseService('budget_homes')
plots_db = DatabaseService('plots')
blogs_db = DatabaseService('blogs')
