from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
from bson import ObjectId
import os

# Database connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'kmk_homes')

client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]

# Collection names
COLLECTIONS = {
    'properties': 'properties',
    'home_banners': 'home_banners',
    'about_sections': 'about_sections',
    'team_members': 'team_members',
    'amenities': 'amenities',
    'upcoming_projects': 'upcoming_projects',
    'testimonials': 'testimonials',
    'news_events': 'news_events',
    'nri_content': 'nri_content',
    'contact_info': 'contact_info',
    'site_settings': 'site_settings',
    'admin_users': 'admin_users',
    'contact_submissions': 'contact_submissions'
}

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
        
        # Add updated_at timestamp
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

# Service instances for each collection
properties_service = DatabaseService(COLLECTIONS['properties'])
home_banners_service = DatabaseService(COLLECTIONS['home_banners'])
about_sections_service = DatabaseService(COLLECTIONS['about_sections'])
team_members_service = DatabaseService(COLLECTIONS['team_members'])
amenities_service = DatabaseService(COLLECTIONS['amenities'])
upcoming_projects_service = DatabaseService(COLLECTIONS['upcoming_projects'])
testimonials_service = DatabaseService(COLLECTIONS['testimonials'])
news_events_service = DatabaseService(COLLECTIONS['news_events'])
nri_content_service = DatabaseService(COLLECTIONS['nri_content'])
contact_info_service = DatabaseService(COLLECTIONS['contact_info'])
site_settings_service = DatabaseService(COLLECTIONS['site_settings'])
admin_users_service = DatabaseService(COLLECTIONS['admin_users'])
contact_submissions_service = DatabaseService(COLLECTIONS['contact_submissions'])