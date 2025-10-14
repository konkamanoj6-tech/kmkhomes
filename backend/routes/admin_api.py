from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer
from typing import List
from services.auth import get_current_admin_user, hash_password, verify_password, create_access_token
from services.database import (
    properties_db, home_banners_db, about_sections_db, team_members_db,
    amenities_db, upcoming_projects_db, testimonials_db, news_events_db,
    nri_content_db, contact_info_db, site_settings_db, admin_users_db,
    contact_submissions_db, budget_homes_db, plots_db
)
from models.cms_models import (
    AdminLogin, AdminCreate, PropertyCreate, HomeBannerCreate, AboutSectionCreate,
    TeamMemberCreate, AmenityCreate, UpcomingProjectCreate, TestimonialCreate,
    NewsEventCreate, NRIContentCreate, ContactInfoUpdate, BudgetHomeCreate, PlotCreate
)
from utils.nearby_places import fetch_nearby_places
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

@router.post("/auth/change-password")
async def change_password(
    password_data: dict,
    current_user: dict = Depends(get_current_admin_user)
):
    """Change admin password."""
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")
    
    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Current password and new password are required")
    
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters long")
    
    # Get current admin
    admin = await admin_users_db.get_one({"username": current_user["username"]})
    if not admin:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(current_password, admin["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    new_password_hash = hash_password(new_password)
    success = await admin_users_db.update_by_id(admin["_id"], {
        "password_hash": new_password_hash,
        "updated_at": datetime.utcnow()
    })
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update password")
    
    return {"message": "Password changed successfully"}

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
    
    # Return file URL - using the correct base URL
    backend_url = os.environ.get('BACKEND_URL', 'https://kmkhomes-cms.preview.emergentagent.com')
    file_url = f"{backend_url}/uploads/{unique_filename}"
    
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

# Happy Clients CRUD
@router.get("/happy-clients")
async def admin_get_happy_clients(current_user: dict = Depends(get_current_admin_user)):
    """Get all happy clients."""
    clients = await testimonials_db.get_all(sort=[("created_at", -1)])
    return clients

@router.post("/happy-clients")
async def admin_create_happy_client(
    data: TestimonialCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create happy client."""
    data_dict = data.dict()
    data_dict["created_at"] = datetime.utcnow()
    data_dict["active"] = True
    client_id = await testimonials_db.create(data_dict)
    return {"id": client_id, "message": "Happy client created successfully"}

@router.put("/happy-clients/{item_id}")
async def admin_update_happy_client(
    item_id: str,
    data: TestimonialCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update happy client."""
    success = await testimonials_db.update_by_id(item_id, data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Happy client not found")
    return {"message": "Happy client updated successfully"}

@router.delete("/happy-clients/{item_id}")
async def admin_delete_happy_client(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete happy client."""
    success = await testimonials_db.delete_by_id(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Happy client not found")
    return {"message": "Happy client deleted successfully"}

# News & Events CRUD
@router.get("/news-events")
async def admin_get_news_events(current_user: dict = Depends(get_current_admin_user)):
    """Get all news and events."""
    news = await news_events_db.get_all(sort=[("created_at", -1)])
    return news

@router.post("/news-events")
async def admin_create_news_event(
    data: NewsEventCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create news/event."""
    data_dict = data.dict()
    data_dict["created_at"] = datetime.utcnow()
    data_dict["active"] = True
    news_id = await news_events_db.create(data_dict)
    return {"id": news_id, "message": "News/Event created successfully"}

@router.put("/news-events/{item_id}")
async def admin_update_news_event(
    item_id: str,
    data: NewsEventCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update news/event."""
    success = await news_events_db.update_by_id(item_id, data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="News/Event not found")
    return {"message": "News/Event updated successfully"}

@router.delete("/news-events/{item_id}")
async def admin_delete_news_event(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete news/event."""
    success = await news_events_db.delete_by_id(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="News/Event not found")
    return {"message": "News/Event deleted successfully"}

# NRI Content CRUD
@router.get("/nri-content")
async def admin_get_nri_content(current_user: dict = Depends(get_current_admin_user)):
    """Get all NRI content."""
    content = await nri_content_db.get_all(sort=[("created_at", -1)])
    return content

@router.post("/nri-content")
async def admin_create_nri_content(
    data: NRIContentCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create NRI content."""
    data_dict = data.dict()
    data_dict["created_at"] = datetime.utcnow()
    data_dict["active"] = True
    content_id = await nri_content_db.create(data_dict)
    return {"id": content_id, "message": "NRI content created successfully"}

@router.put("/nri-content/{item_id}")
async def admin_update_nri_content(
    item_id: str,
    data: NRIContentCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update NRI content."""
    success = await nri_content_db.update_by_id(item_id, data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="NRI content not found")
    return {"message": "NRI content updated successfully"}

@router.delete("/nri-content/{item_id}")
async def admin_delete_nri_content(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete NRI content."""
    success = await nri_content_db.delete_by_id(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="NRI content not found")
    return {"message": "NRI content deleted successfully"}

# Amenities CRUD
@router.get("/amenities")
async def admin_get_amenities(current_user: dict = Depends(get_current_admin_user)):
    """Get all amenities."""
    amenities = await amenities_db.get_all(sort=[("display_order", 1), ("created_at", -1)])
    return amenities

@router.post("/amenities")
async def admin_create_amenity(
    data: AmenityCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create amenity."""
    data_dict = data.dict()
    data_dict["created_at"] = datetime.utcnow()
    data_dict["active"] = True
    amenity_id = await amenities_db.create(data_dict)
    return {"id": amenity_id, "message": "Amenity created successfully"}

@router.put("/amenities/{item_id}")
async def admin_update_amenity(
    item_id: str,
    data: AmenityCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update amenity."""
    success = await amenities_db.update_by_id(item_id, data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Amenity not found")
    return {"message": "Amenity updated successfully"}

@router.delete("/amenities/{item_id}")
async def admin_delete_amenity(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete amenity."""
    success = await amenities_db.delete_by_id(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Amenity not found")
    return {"message": "Amenity deleted successfully"}

# Budget Homes CRUD
@router.get("/budget-homes")
async def admin_get_budget_homes(current_user: dict = Depends(get_current_admin_user)):
    """Get all budget homes for admin."""
    homes = await budget_homes_db.get_all(sort=[("display_order", 1), ("created_at", -1)])
    return homes

@router.post("/budget-homes")
async def admin_create_budget_home(
    home_data: BudgetHomeCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create new budget home."""
    home_dict = home_data.dict()
    home_dict["created_at"] = datetime.utcnow()
    home_dict["active"] = True
    
    home_id = await budget_homes_db.create(home_dict)
    return {"id": home_id, "message": "Budget home created successfully"}

@router.put("/budget-homes/{home_id}")
async def admin_update_budget_home(
    home_id: str,
    home_data: BudgetHomeCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update budget home."""
    success = await budget_homes_db.update_by_id(home_id, home_data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Budget home not found")
    return {"message": "Budget home updated successfully"}

@router.delete("/budget-homes/{home_id}")
async def admin_delete_budget_home(
    home_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete budget home."""
    success = await budget_homes_db.delete_by_id(home_id)
    if not success:
        raise HTTPException(status_code=404, detail="Budget home not found")
    return {"message": "Budget home deleted successfully"}

# Plots CRUD
@router.get("/plots")
async def admin_get_plots(current_user: dict = Depends(get_current_admin_user)):
    """Get all plots for admin."""
    plots = await plots_db.get_all(sort=[("display_order", 1), ("created_at", -1)])
    return plots

@router.post("/plots")
async def admin_create_plot(
    plot_data: PlotCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Create new plot."""
    plot_dict = plot_data.dict()
    plot_dict["created_at"] = datetime.utcnow()
    plot_dict["active"] = True
    
    plot_id = await plots_db.create(plot_dict)
    return {"id": plot_id, "message": "Plot created successfully"}

@router.put("/plots/{plot_id}")
async def admin_update_plot(
    plot_id: str,
    plot_data: PlotCreate,
    current_user: dict = Depends(get_current_admin_user)
):
    """Update plot."""
    success = await plots_db.update_by_id(plot_id, plot_data.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Plot not found")
    return {"message": "Plot updated successfully"}

@router.delete("/plots/{plot_id}")
async def admin_delete_plot(
    plot_id: str,
    current_user: dict = Depends(get_current_admin_user)
):
    """Delete plot."""
    success = await plots_db.delete_by_id(plot_id)
    if not success:
        raise HTTPException(status_code=404, detail="Plot not found")
    return {"message": "Plot deleted successfully"}
