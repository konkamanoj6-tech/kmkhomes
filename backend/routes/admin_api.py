from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer
from typing import List
from services.auth import get_current_admin_user, hash_password, verify_password, create_access_token
from services.database import (
    properties_db, home_banners_db, about_sections_db, team_members_db,
    amenities_db, upcoming_projects_db, testimonials_db, news_events_db,
    nri_content_db, contact_info_db, site_settings_db, admin_users_db,
    contact_submissions_db
)
from models.cms_models import (
    AdminLogin, AdminCreate, PropertyCreate, HomeBannerCreate, AboutSectionCreate,
    TeamMemberCreate, AmenityCreate, UpcomingProjectCreate, TestimonialCreate,
    NewsEventCreate, NRIContentCreate, ContactInfoUpdate
)
import os
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

# Auth endpoints
@router.post("/auth/login")
async def admin_login(credentials: AdminLogin):
    """Admin login."""
    admin = await admin_users_db.get_one({"username": credentials.username})
    
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not admin.get("active", True):
        raise HTTPException(status_code=401, detail="Account disabled")
    
    access_token = create_access_token(
        data={"sub": admin["username"], "role": admin["role"]},
        expires_delta=timedelta(hours=8)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": admin["username"],
            "email": admin["email"],
            "role": admin["role"]
        }
    }

@router.get("/auth/me")
async def get_current_user(current_user: dict = Depends(get_current_admin_user)):
    """Get current admin user."""
    admin = await admin_users_db.get_one({"username": current_user["username"]})
    if not admin:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": admin["username"],
        "email": admin["email"],
        "role": admin["role"]
    }

# File upload
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_admin_user)
):
    """Upload file."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "/app/backend/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Return file URL (you may need to adjust this based on your static file serving)
    file_url = f"/uploads/{unique_filename}"
    
    return {"file_url": file_url, "filename": unique_filename}

# Properties CRUD
@router.get("/properties")
async def admin_get_properties(current_user: dict = Depends(get_current_admin_user)):
    """Get all properties for admin."""
    properties = await properties_db.get_all(sort=[("created_at", -1)])
    return properties

@router.post("/properties")
async def admin_create_property(
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create new property."""
    property_dict = property_data.dict()
    property_dict["created_at"] = datetime.utcnow()
    property_dict["active"] = True
    
    property_id = await properties_db.create(property_dict)
    return {"id": property_id, "message": "Property created successfully"}

@router.put("/properties/{property_id}")
async def admin_update_property(
    property_id: str,
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update property."""
    success = await properties_db.update_by_id(property_id, property_data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property updated successfully"}

@router.delete("/properties/{property_id}")
async def admin_delete_property(
    property_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete property."""
    success = await properties_db.delete_by_id(property_id)
    if not success:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}

# Home Banners CRUD
@router.get("/home-banners")
async def admin_get_banners(current_user: dict = Depends(get_current_admin_user)):
    """Get all home banners."""
    banners = await home_banners_db.get_all(sort=[("display_order", 1)])
    return banners

@router.post("/home-banners")
async def admin_create_banner(
    banner_data: HomeBannerCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create home banner."""
    banner_dict = banner_data.dict()
    banner_dict["created_at"] = datetime.utcnow()
    banner_dict["active"] = True
    
    banner_id = await home_banners_db.create(banner_dict)
    return {"id": banner_id, "message": "Banner created successfully"}

@router.put("/home-banners/{banner_id}")
async def admin_update_banner(
    banner_id: str,
    banner_data: HomeBannerCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update banner."""
    success = await home_banners_db.update_by_id(banner_id, banner_data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Banner not found")
    return {"message": "Banner updated successfully"}

@router.delete("/home-banners/{banner_id}")
async def admin_delete_banner(
    banner_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete banner."""
    success = await home_banners_db.delete_by_id(banner_id)
    if not success:
        raise HTTPException(status_code=404, detail="Banner not found")
    return {"message": "Banner deleted successfully"}

# Similar CRUD endpoints for other collections...
# (I'll create simplified versions for the remaining collections)

@router.get("/testimonials")
async def admin_get_testimonials(current_user: dict = Depends(get_current_admin_user)):
    return await testimonials_db.get_all(sort=[("created_at", -1)])

@router.post("/testimonials")
async def admin_create_testimonial(
    data: TestimonialCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    data_dict = data.dict()
    data_dict["created_at"] = datetime.utcnow()
    data_dict["active"] = True
    testimonial_id = await testimonials_db.create(data_dict)
    return {"id": testimonial_id, "message": "Testimonial created successfully"}

@router.put("/testimonials/{item_id}")
async def admin_update_testimonial(
    item_id: str,
    data: TestimonialCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    success = await testimonials_db.update_by_id(item_id, data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial updated successfully"}

@router.delete("/testimonials/{item_id}")
async def admin_delete_testimonial(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    success = await testimonials_db.delete_by_id(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

# Contact Info
@router.get("/contact-info")
async def admin_get_contact_info(current_user: dict = Depends(get_current_admin_user)):
    """Get contact info."""
    contact = await contact_info_db.get_one({})
    return contact

@router.put("/contact-info")
async def admin_update_contact_info(
    contact_data: ContactInfoUpdate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update contact info."""
    # Check if contact info exists
    existing = await contact_info_db.get_one({})
    
    if existing:
        # Update existing
        success = await contact_info_db.update_by_id(existing["_id"], contact_data.dict(exclude_unset=True))
        if not success:
            raise HTTPException(status_code=400, detail="Failed to update contact info")
    else:
        # Create new
        contact_dict = contact_data.dict(exclude_unset=True)
        contact_dict["created_at"] = datetime.utcnow()
        await contact_info_db.create(contact_dict)
    
    return {"message": "Contact info updated successfully"}

# Contact Form Submissions
@router.get("/contact-submissions")
async def admin_get_contact_submissions(current_user: dict = Depends(get_current_admin_user)):
    """Get contact form submissions."""
    submissions = await contact_submissions_db.get_all(sort=[("created_at", -1)])
    return submissions