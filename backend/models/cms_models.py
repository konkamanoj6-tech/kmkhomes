from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid ObjectId')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type='string')
        return field_schema

class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        use_enum_values = True

# Properties Model
class Property(BaseDocument):
    villa_number: str
    status: str = Field(..., description="Available, Sold Out, Coming Soon")
    plot_size: int = Field(..., description="Plot size in Sq. Yds")
    built_up_area: int = Field(..., description="Built-up area in Sq. Ft")
    facing: str = Field(..., description="East, West, North, South-East")
    location: str
    price_range: str
    gallery_images: List[str] = Field(default_factory=list)
    description: str
    amenities: List[str] = Field(default_factory=list)
    enquiry_link: str
    map_link: str
    featured: bool = Field(default=False)
    active: bool = Field(default=True)

class PropertyCreate(BaseModel):
    villa_number: str
    status: str
    plot_size: int
    built_up_area: int
    facing: str
    location: str
    price_range: str
    gallery_images: List[str] = Field(default_factory=list)
    description: str
    amenities: List[str] = Field(default_factory=list)
    enquiry_link: str
    map_link: str
    featured: bool = Field(default=False)

# Home Banners Model
class HomeBanner(BaseDocument):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    active: bool = Field(default=True)
    display_order: int = Field(default=0)

class HomeBannerCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    display_order: int = Field(default=0)

# About Section Model
class AboutSection(BaseDocument):
    section_name: str = Field(..., description="company_story, mission, vision")
    title: str
    content: str
    image_url: Optional[str] = None
    active: bool = Field(default=True)
    display_order: int = Field(default=0)

class AboutSectionCreate(BaseModel):
    section_name: str
    title: str
    content: str
    image_url: Optional[str] = None
    display_order: int = Field(default=0)

# Team Member Model
class TeamMember(BaseDocument):
    name: str
    position: str
    bio: str
    image_url: str
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class TeamMemberCreate(BaseModel):
    name: str
    position: str
    bio: str
    image_url: str
    display_order: int = Field(default=0)

# Amenity Model
class Amenity(BaseDocument):
    title: str
    description: str
    icon_name: str = Field(..., description="Lucide icon name")
    image_url: Optional[str] = None
    active: bool = Field(default=True)
    display_order: int = Field(default=0)

class AmenityCreate(BaseModel):
    title: str
    description: str
    icon_name: str
    image_url: Optional[str] = None
    display_order: int = Field(default=0)

# Upcoming Project Model
class UpcomingProject(BaseDocument):
    title: str
    description: str
    launch_date: Optional[datetime] = None
    location: str
    image_url: str
    features: List[str] = Field(default_factory=list)
    early_access_link: Optional[str] = None
    active: bool = Field(default=True)

class UpcomingProjectCreate(BaseModel):
    title: str
    description: str
    launch_date: Optional[datetime] = None
    location: str
    image_url: str
    features: List[str] = Field(default_factory=list)
    early_access_link: Optional[str] = None

# Testimonial Model
class Testimonial(BaseDocument):
    name: str
    location: str
    testimonial: str
    image_url: str
    rating: int = Field(default=5, ge=1, le=5)
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class TestimonialCreate(BaseModel):
    name: str
    location: str
    testimonial: str
    image_url: str
    rating: int = Field(default=5, ge=1, le=5)
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)

# News Event Model
class NewsEvent(BaseDocument):
    title: str
    excerpt: str
    content: str
    image_url: str
    category: str = Field(..., description="News, Events, Projects, Awards")
    author: str
    publish_date: datetime = Field(default_factory=datetime.utcnow)
    event_date: Optional[datetime] = None
    featured: bool = Field(default=False)
    active: bool = Field(default=True)

class NewsEventCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: str
    category: str
    author: str
    publish_date: Optional[datetime] = None
    event_date: Optional[datetime] = None
    featured: bool = Field(default=False)

# NRI Content Model
class NRIContent(BaseDocument):
    section_name: str = Field(..., description="services, benefits, process, legal")
    title: str
    content: str
    icon_name: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class NRIContentCreate(BaseModel):
    section_name: str
    title: str
    content: str
    icon_name: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = Field(default=0)

# Contact Info Model
class ContactInfo(BaseDocument):
    company_name: str = Field(default="KMK Homes")
    phone: str
    email: str
    whatsapp: str
    address: str
    map_embed_url: str
    business_hours: str

class ContactInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    map_embed_url: Optional[str] = None
    business_hours: Optional[str] = None

# Site Settings Model
class SiteSetting(BaseDocument):
    setting_key: str
    setting_value: str

# Admin User Model
class AdminUser(BaseDocument):
    username: str
    email: str
    password_hash: str
    role: str = Field(default="admin")
    active: bool = Field(default=True)

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

# Contact Form Submission Model
class ContactSubmission(BaseDocument):
    name: str
    email: str
    phone: str
    property_interest: Optional[str] = None
    visit_date: Optional[str] = None
    message: str
    status: str = Field(default="new")

class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    phone: str
    property_interest: Optional[str] = None
    visit_date: Optional[str] = None
    message: str

# Our Projects Model (In-house projects)
class OurProject(BaseDocument):
    project_name: str
    location: str
    status: str = Field(..., description="Available, Sold Out, Coming Soon")
    plot_size: Optional[int] = Field(None, description="Plot size in Sq. Yds")
    built_up_area: Optional[int] = Field(None, description="Built-up area in Sq. Ft")
    facing: Optional[str] = Field(None, description="East, West, North, South-East")
    price_range: str = Field(..., description="Affordable, Mid-range, Premium")
    property_type: str = Field(..., description="Apartment, Villa, Plot, Commercial")
    description: str
    thumbnail_image: str
    gallery_images: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    youtube_link: Optional[str] = None
    enquiry_link: Optional[str] = None
    map_link: Optional[str] = None
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class OurProjectCreate(BaseModel):
    project_name: str
    location: str
    status: str
    plot_size: Optional[int] = None
    built_up_area: Optional[int] = None
    facing: Optional[str] = None
    price_range: str
    property_type: str
    description: str
    thumbnail_image: str
    gallery_images: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    youtube_link: Optional[str] = None
    enquiry_link: Optional[str] = None
    map_link: Optional[str] = None
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)

# Homes for Every Budget Model (External projects)
class BudgetHome(BaseDocument):
    project_name: str
    location: str
    price_range: str = Field(..., description="Affordable, Mid-range, Premium")
    property_type: str = Field(..., description="Apartment, Villa, Plot, Commercial")
    short_description: str
    thumbnail_image: str
    youtube_link: Optional[str] = None
    builder_name: str = Field(..., description="Internal use only - not displayed")
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class BudgetHomeCreate(BaseModel):
    project_name: str
    location: str
    price_range: str
    property_type: str
    short_description: str
    thumbnail_image: str
    youtube_link: Optional[str] = None
    builder_name: str
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)

# Plots Model (Land/Plot listings)
class Plot(BaseDocument):
    title: str = Field(..., description="Plot Name/Title")
    location: str
    price_range: str
    area_sqyds: Optional[float] = Field(None, description="Area in Square Yards")
    area_sqft: Optional[float] = Field(None, description="Area in Square Feet")
    short_description: str
    main_image: str
    gallery_images: List[str] = Field(default_factory=list)
    youtube_link: Optional[str] = None
    status: str = Field(default="Available", description="Available, Sold, Upcoming")
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class PlotCreate(BaseModel):
    title: str
    location: str
    price_range: str
    area_sqyds: Optional[float] = None
    area_sqft: Optional[float] = None
    short_description: str
    main_image: str
    gallery_images: List[str] = Field(default_factory=list)
    youtube_link: Optional[str] = None
    status: str = Field(default="Available")
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)

# Amenity Model
class Amenity(BaseDocument):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    category: str = Field(default="general")
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    active: bool = Field(default=True)

class AmenityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    category: str = Field(default="general")
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)