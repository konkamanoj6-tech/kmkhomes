#!/usr/bin/env python3
"""
Seed script to populate KMK Homes CMS with initial data
"""
import asyncio
import os
from datetime import datetime, timedelta
from services.database import (
    properties_db, home_banners_db, about_sections_db, team_members_db,
    amenities_db, upcoming_projects_db, testimonials_db, news_events_db,
    nri_content_db, contact_info_db, site_settings_db
)

async def seed_properties():
    """Seed properties data."""
    properties = [
        {
            "villa_number": "KMK-001",
            "status": "Available",
            "plot_size": 2400,
            "built_up_area": 3200,
            "facing": "East",
            "location": "Jubilee Hills, Hyderabad",
            "price_range": "₹2.5 - 3.2 Cr",
            "gallery_images": [
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg"
            ],
            "description": "Ultra Luxury Triplex Villa with modern architecture, premium finishes, and world-class amenities. Perfect for families seeking luxury living in prime location.",
            "amenities": ["Swimming Pool", "Clubhouse", "Kids Play Area", "Solar Power", "24/7 Security", "Power Backup"],
            "enquiry_link": "https://wa.me/919876543210",
            "map_link": "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
            "featured": True,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "villa_number": "KMK-002",
            "status": "Available",
            "plot_size": 2000,
            "built_up_area": 2800,
            "facing": "West",
            "location": "Banjara Hills, Hyderabad",
            "price_range": "₹2.2 - 2.8 Cr",
            "gallery_images": [
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/8xyjt9jf_IMG_9421.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/52snr89o_IMG_9420.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg"
            ],
            "description": "Contemporary Villa Design with sophisticated interiors and premium lifestyle amenities in the heart of Banjara Hills.",
            "amenities": ["Gymnasium", "Garden", "Parking", "Solar Power", "24/7 Security", "Water Supply"],
            "enquiry_link": "https://wa.me/919876543210",
            "map_link": "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
            "featured": True,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "villa_number": "KMK-003",
            "status": "Sold Out",
            "plot_size": 1800,
            "built_up_area": 2400,
            "facing": "South-East",
            "location": "Kondapur, Hyderabad",
            "price_range": "₹1.8 - 2.3 Cr",
            "gallery_images": [
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg"
            ],
            "description": "Modern Villa with excellent connectivity and premium amenities in the IT corridor of Kondapur.",
            "amenities": ["Swimming Pool", "Clubhouse", "Parking", "Security", "Power Backup"],
            "enquiry_link": "https://wa.me/919876543210",
            "map_link": "https://maps.google.com/?q=Kondapur+Hyderabad",
            "featured": False,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "villa_number": "KMK-004",
            "status": "Available",
            "plot_size": 2200,
            "built_up_area": 3000,
            "facing": "North",
            "location": "Gachibowli, Hyderabad",
            "price_range": "₹2.4 - 3.0 Cr",
            "gallery_images": [
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/52snr89o_IMG_9420.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/8xyjt9jf_IMG_9421.jpeg"
            ],
            "description": "Premium Villa in the prime IT hub with modern amenities and excellent investment potential.",
            "amenities": ["Clubhouse", "Garden", "Parking", "Solar Power", "24/7 Security", "Water Supply"],
            "enquiry_link": "https://wa.me/919876543210",
            "map_link": "https://maps.google.com/?q=Gachibowli+Hyderabad",
            "featured": True,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "villa_number": "KMK-005",
            "status": "Available",
            "plot_size": 2600,
            "built_up_area": 3400,
            "facing": "East",
            "location": "Madhapur, Hyderabad",
            "price_range": "₹2.8 - 3.5 Cr",
            "gallery_images": [
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
                "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg"
            ],
            "description": "Luxury Villa with spacious layout and premium finishes in the heart of Hyderabad's IT corridor.",
            "amenities": ["Swimming Pool", "Gymnasium", "Kids Play Area", "Parking", "24/7 Security", "Power Backup"],
            "enquiry_link": "https://wa.me/919876543210",
            "map_link": "https://maps.google.com/?q=Madhapur+Hyderabad",
            "featured": False,
            "active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    # Clear existing properties and insert new ones
    await properties_db.collection.delete_many({})
    for property_data in properties:
        await properties_db.create(property_data)
    
    print(f"✅ Seeded {len(properties)} properties")

async def seed_home_banners():
    """Seed home banners data."""
    banners = [
        {
            "title": "Find Your Dream Home",
            "subtitle": "with KMK Homes",
            "image_url": "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
            "cta_text": "View All Projects",
            "cta_link": "/projects",
            "active": True,
            "display_order": 1,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Luxury Living",
            "subtitle": "Premium Villas in Prime Locations",
            "image_url": "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg",
            "cta_text": "Book Site Visit",
            "cta_link": "/contact",
            "active": True,
            "display_order": 2,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Modern Architecture",
            "subtitle": "World-Class Amenities & Design",
            "image_url": "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg",
            "cta_text": "Explore Features",
            "cta_link": "/amenities",
            "active": True,
            "display_order": 3,
            "created_at": datetime.utcnow()
        }
    ]
    
    await home_banners_db.collection.delete_many({})
    for banner in banners:
        await home_banners_db.create(banner)
    
    print(f"✅ Seeded {len(banners)} home banners")

async def seed_testimonials():
    """Seed testimonials data."""
    testimonials = [
        {
            "name": "Rajesh Kumar",
            "location": "Jubilee Hills Villa Owner",
            "testimonial": "KMK Homes delivered exactly what they promised. The quality of construction and attention to detail is exceptional. Our dream villa became a reality!",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "rating": 5,
            "featured": True,
            "display_order": 1,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "Priya Sharma",
            "location": "Banjara Hills Villa Owner",
            "testimonial": "Professional team, transparent process, and outstanding results. KMK Homes made our home buying journey smooth and stress-free.",
            "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            "rating": 5,
            "featured": True,
            "display_order": 2,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "David Johnson",
            "location": "NRI Investor - USA",
            "testimonial": "As an NRI, I was concerned about the investment process. KMK Homes provided complete support and made everything seamless from abroad.",
            "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "rating": 5,
            "featured": True,
            "display_order": 3,
            "active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    await testimonials_db.collection.delete_many({})
    for testimonial in testimonials:
        await testimonials_db.create(testimonial)
    
    print(f"✅ Seeded {len(testimonials)} testimonials")

async def seed_amenities():
    """Seed amenities data."""
    amenities = [
        {
            "title": "24/7 Security",
            "description": "Round-the-clock security with CCTV surveillance and trained guards",
            "icon_name": "Shield",
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 1,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Power & Water Backup",
            "description": "Uninterrupted power supply with diesel generators and solar panels",
            "icon_name": "Zap",
            "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 2,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Swimming Pool",
            "description": "Luxurious swimming pool with kids section and poolside amenities",
            "icon_name": "Waves",
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 3,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Fitness Center",
            "description": "Fully equipped gymnasium with modern equipment and trainers",
            "icon_name": "Dumbbell",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 4,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Landscaped Gardens",
            "description": "Beautiful green spaces with walking paths and recreational areas",
            "icon_name": "Trees",
            "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 5,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Covered Parking",
            "description": "Secure covered parking for residents and guest vehicles",
            "icon_name": "Car",
            "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
            "active": True,
            "display_order": 6,
            "created_at": datetime.utcnow()
        }
    ]
    
    await amenities_db.collection.delete_many({})
    for amenity in amenities:
        await amenities_db.create(amenity)
    
    print(f"✅ Seeded {len(amenities)} amenities")

async def seed_contact_info():
    """Seed contact information."""
    contact_data = {
        "company_name": "KMK Homes",
        "phone": "+91 98765 43210",
        "email": "info@kmkhomes.com",
        "whatsapp": "919876543210",
        "address": "Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033",
        "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.35148728277!2d78.24323262812499!3d17.412608040492422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1645678901234!5m2!1sen!2sin",
        "business_hours": "Mon - Sat: 9:00 AM - 7:00 PM\nSun: 10:00 AM - 5:00 PM",
        "created_at": datetime.utcnow()
    }
    
    await contact_info_db.collection.delete_many({})
    await contact_info_db.create(contact_data)
    
    print("✅ Seeded contact information")

async def seed_news_events():
    """Seed news and events data."""
    news_events = [
        {
            "title": "KMK Homes Launches New Premium Villa Project in Gachibowli",
            "excerpt": "New ultra-luxury villa project with modern amenities and premium finishes now open for bookings.",
            "content": "KMK Homes is excited to announce the launch of our newest premium villa project in the heart of Gachibowli. This project features state-of-the-art amenities, modern architecture, and prime location advantage.",
            "image_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
            "category": "Projects",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=5),
            "featured": True,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Special NRI Investment Program Announced",
            "excerpt": "Exclusive benefits and support services for Non-Resident Indian investors in our villa projects.",
            "content": "We are pleased to introduce our comprehensive NRI investment program with special financing options, legal support, and property management services.",
            "image_url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
            "category": "News",
            "author": "Investment Team",
            "publish_date": datetime.utcnow() - timedelta(days=10),
            "featured": False,
            "active": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Sustainable Living Initiative with Solar Power Integration",
            "excerpt": "All new villas will feature integrated solar power systems for eco-friendly living.",
            "content": "As part of our commitment to sustainability, all new KMK Homes villas will come equipped with solar power systems, rainwater harvesting, and energy-efficient designs.",
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
            "category": "Sustainability",
            "author": "Sustainability Team",
            "publish_date": datetime.utcnow() - timedelta(days=15),
            "featured": False,
            "active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    await news_events_db.collection.delete_many({})
    for news in news_events:
        await news_events_db.create(news)
    
    print(f"✅ Seeded {len(news_events)} news/events")

async def main():
    """Main seeding function."""
    print("🌱 Starting KMK Homes CMS data seeding...")
    
    await seed_properties()
    await seed_home_banners()
    await seed_testimonials()
    await seed_amenities()
    await seed_contact_info()
    await seed_news_events()
    
    print("🎉 Data seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())