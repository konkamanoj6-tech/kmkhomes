from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from routes.public_api import router as public_router
from routes.admin_api import router as admin_router
from services.database import admin_users_db
from services.auth import hash_password
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="KMK Homes CMS API", version="1.0.0")

# Create uploads directory and serve static files
uploads_dir = Path("/app/backend/uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "KMK Homes CMS API is running", "status": "healthy"}

# Include public and admin routers
api_router.include_router(public_router, tags=["public"])
api_router.include_router(admin_router, tags=["admin"])

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Create default admin user if not exists."""
    try:
        # Check if admin user exists
        existing_admin = await admin_users_db.get_one({"username": "admin"})
        
        if not existing_admin:
            # Create default admin user
            admin_data = {
                "username": "admin",
                "email": "admin@kmkhomes.com",
                "password_hash": hash_password("Manojntr12@"),
                "role": "admin",
                "active": True,
                "created_at": datetime.utcnow()
            }
            
            await admin_users_db.create(admin_data)
            logger.info("Default admin user created: username=admin, password=Manojntr12@")
        else:
            # Update existing admin password
            updated_password = hash_password("Manojntr12@")
            await admin_users_db.update_by_id(
                existing_admin["_id"],
                {"password_hash": updated_password}
            )
            logger.info("Admin user password updated")
            
    except Exception as e:
        logger.error(f"Error creating/updating default admin user: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Cleanup on shutdown."""
    pass
