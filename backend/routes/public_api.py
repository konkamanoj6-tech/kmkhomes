from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services.database import (
    properties_db, home_banners_db, about_sections_db, team_members_db,
    amenities_db, upcoming_projects_db, testimonials_db, news_events_db,
    nri_content_db, contact_info_db, site_settings_db, contact_submissions_db,
    budget_homes_db, plots_db, blogs_db
)
from models.cms_models import Property, ContactSubmissionCreate, ContactSubmission
from datetime import datetime

router = APIRouter()

@router.get("/properties")
async def get_properties(
    status: Optional[str] = Query(None, description="Filter by status"),
    facing: Optional[str] = Query(None, description="Filter by facing"),
    location: Optional[str] = Query(None, description="Filter by location"),
    featured: Optional[bool] = Query(None, description="Filter featured properties"),
    limit: Optional[int] = Query(None, description="Limit results"),
    skip: int = Query(0, description="Skip results")
):
    """Get all properties with optional filtering."""
    filters = {"active": True}
    
    if status:
        filters["status"] = status
    if facing:
        filters["facing"] = facing
    if location:
        filters["location"] = {"$regex": location, "$options": "i"}
    if featured is not None:
        filters["featured"] = featured
    
    properties = await properties_db.get_all(
        filters=filters,
        sort=[("featured", -1), ("created_at", -1)],
        limit=limit,
        skip=skip
    )
    return properties

@router.get("/properties/{property_id}")
async def get_property(property_id: str):
    """Get single property by ID."""
    property_data = await properties_db.get_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data

@router.get("/home-banners")
async def get_home_banners():
    """Get active home banners."""
    banners = await home_banners_db.get_all(
        filters={"active": True},
        sort=[("display_order", 1), ("created_at", -1)]
    )
    return banners

@router.get("/about-sections")
async def get_about_sections():
    """Get about us sections."""
    sections = await about_sections_db.get_all(
        filters={"active": True},
        sort=[("display_order", 1)]
    )
    return sections

@router.get("/team-members")
async def get_team_members():
    """Get team members."""
    members = await team_members_db.get_all(
        filters={"active": True},
        sort=[("display_order", 1)]
    )
    return members

@router.get("/amenities")
async def get_amenities():
    """Get amenities."""
    amenities = await amenities_db.get_all(
        filters={"active": True},
        sort=[("display_order", 1)]
    )
    return amenities

@router.get("/upcoming-projects")
async def get_upcoming_projects():
    """Get upcoming projects."""
    projects = await upcoming_projects_db.get_all(
        filters={"active": True},
        sort=[("launch_date", 1)]
    )
    return projects

@router.get("/testimonials")
async def get_testimonials(featured: Optional[bool] = Query(None)):
    """Get testimonials."""
    filters = {"active": True}
    if featured is not None:
        filters["featured"] = featured
    
    testimonials = await testimonials_db.get_all(
        filters=filters,
        sort=[("featured", -1), ("display_order", 1)]
    )
    return testimonials

@router.get("/news-events")
async def get_news_events(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    limit: Optional[int] = Query(10),
    skip: int = Query(0)
):
    """Get news and events."""
    filters = {"active": True}
    if category:
        filters["category"] = category
    if featured is not None:
        filters["featured"] = featured
    
    news = await news_events_db.get_all(
        filters=filters,
        sort=[("featured", -1), ("publish_date", -1)],
        limit=limit,
        skip=skip
    )
    return news

@router.get("/nri-content")
async def get_nri_content(section: Optional[str] = Query(None)):
    """Get NRI content."""
    filters = {"active": True}
    if section:
        filters["section_name"] = section
    
    content = await nri_content_db.get_all(
        filters=filters,
        sort=[("display_order", 1)]
    )
    return content

@router.get("/contact-info")
async def get_contact_info():
    """Get contact information."""
    contact = await contact_info_db.get_one({})
    return contact

@router.get("/site-settings/{key}")
async def get_site_setting(key: str):
    """Get site setting by key."""
    setting = await site_settings_db.get_one({"setting_key": key})
    return setting

@router.post("/contact-form")
async def submit_contact_form(submission: ContactSubmissionCreate):
    """Submit contact form."""
    submission_dict = submission.dict()
    submission_dict["created_at"] = datetime.utcnow()
    submission_dict["status"] = "new"
    
    submission_id = await contact_submissions_db.create(submission_dict)


@router.get("/budget-homes")
async def get_budget_homes(
    location: Optional[str] = Query(None, description="Filter by location"),
    price_range: Optional[str] = Query(None, description="Filter by price range"),
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    facing: Optional[str] = Query(None, description="Filter by facing"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: Optional[int] = Query(None, description="Limit results"),
    skip: int = Query(0, description="Skip results")
):
    """Get all budget homes with optional filtering."""
    filters = {"active": True}
    
    if location:
        filters["location"] = {"$regex": location, "$options": "i"}
    if price_range:
        filters["price_range"] = {"$regex": price_range, "$options": "i"}
    if property_type:
        filters["property_type"] = property_type
    if facing:
        filters["facing"] = facing
    if status:
        filters["status"] = status
    
    homes = await budget_homes_db.get_all(
        filters=filters,
        sort=[("display_order", 1), ("created_at", -1)],
        limit=limit,
        skip=skip
    )
    return homes

@router.get("/budget-homes/{home_id}")
async def get_budget_home(home_id: str):
    """Get single budget home by ID."""
    home = await budget_homes_db.get_by_id(home_id)
    if not home:
        raise HTTPException(status_code=404, detail="Budget home not found")
    return home

@router.get("/plots")
async def get_plots(
    location: Optional[str] = Query(None, description="Filter by location"),
    plot_area: Optional[str] = Query(None, description="Filter by plot area"),
    price_range: Optional[str] = Query(None, description="Filter by price range"),
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: Optional[int] = Query(None, description="Limit results"),
    skip: int = Query(0, description="Skip results")
):
    """Get all plots with optional filtering."""
    filters = {"active": True}
    
    if location:
        filters["location"] = {"$regex": location, "$options": "i"}
    if plot_area:
        filters["plot_area"] = {"$regex": plot_area, "$options": "i"}
    if price_range:
        filters["price_range"] = {"$regex": price_range, "$options": "i"}
    if property_type:
        filters["property_type"] = property_type
    if status:
        filters["status"] = status
    
    plots = await plots_db.get_all(
        filters=filters,
        sort=[("display_order", 1), ("created_at", -1)],
        limit=limit,
        skip=skip
    )
    return plots

@router.get("/plots/{plot_id}")
async def get_plot(plot_id: str):
    """Get single plot by ID."""
    plot = await plots_db.get_by_id(plot_id)
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot


# ========================
# Blog/Insights Public APIs
# ========================

@router.get("/blogs")
async def get_blogs(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured blogs"),
    limit: Optional[int] = Query(20, description="Limit results"),
    skip: Optional[int] = Query(0, description="Skip results")
):
    """Get all active blog posts with optional filters."""
    filters = {"active": True}
    
    if category:
        filters["category"] = category
    
    if featured is not None:
        filters["featured"] = featured
    
    blogs = await blogs_db.get_all(
        filters=filters,
        sort=[("publish_date", -1)],
        limit=limit,
        skip=skip
    )
    return blogs

@router.get("/blogs/slug/{slug}")
async def get_blog_by_slug(slug: str):
    """Get single blog post by slug."""
    blog = await blogs_db.get_one({"slug": slug, "active": True})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Increment view count
    await blogs_db.update_by_id(blog["_id"], {"views": blog.get("views", 0) + 1})
    
    return blog

@router.get("/blogs/{blog_id}")
async def get_blog_by_id(blog_id: str):
    """Get single blog post by ID."""
    blog = await blogs_db.get_by_id(blog_id)
    if not blog or not blog.get("active", True):
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Increment view count
    await blogs_db.update_by_id(blog_id, {"views": blog.get("views", 0) + 1})
    
    return blog

@router.get("/blogs/categories/all")
async def get_blog_categories():
    """Get all unique blog categories."""
    # This could be enhanced to fetch from database dynamically
    return {
        "categories": [
            "Luxury Villas",
            "Budget Homes",
            "Open Plots",
            "Market Insights"
        ]
    }

    return {"message": "Contact form submitted successfully", "id": submission_id}