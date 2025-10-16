import asyncio
from services.database import blogs_db
from datetime import datetime, timedelta

async def seed_blogs():
    """Seed sample blog posts for KMK Homes."""
    
    sample_blogs = [
        {
            "title": "Top 5 Reasons to Invest in Sainikpuri Villas",
            "slug": "top-5-reasons-invest-sainikpuri-villas",
            "excerpt": "Discover why Sainikpuri is emerging as the hottest real estate destination in Hyderabad for luxury villa investments.",
            "content": """
                <h2>Why Sainikpuri is the Perfect Location for Your Dream Villa</h2>
                <p>Sainikpuri, nestled in the heart of Hyderabad, has emerged as one of the most sought-after locations for luxury villa investments. With its strategic location, world-class amenities, and excellent connectivity, it's no wonder that discerning homebuyers are flocking to this premium locality.</p>
                
                <h3>1. Strategic Location with Excellent Connectivity</h3>
                <p>Located just 10 km from Secunderabad Railway Station and 25 km from Rajiv Gandhi International Airport, Sainikpuri offers unparalleled connectivity. The upcoming metro connectivity will further enhance accessibility.</p>
                
                <h3>2. Premium Educational Institutions Nearby</h3>
                <p>Home to some of Hyderabad's best schools including Delhi Public School, Oakridge International School, and Englis Medium Schools, Sainikpuri is perfect for families prioritizing education.</p>
                
                <h3>3. World-Class Healthcare Facilities</h3>
                <p>With Apollo Hospitals, Yashoda Hospitals, and Care Hospitals in close proximity, residents enjoy access to top-tier medical care.</p>
                
                <h3>4. Thriving IT Hub Proximity</h3>
                <p>Just 15 minutes from major IT parks in Gachibowli and HITEC City, Sainikpuri is ideal for IT professionals seeking luxury living with a short commute.</p>
                
                <h3>5. High Appreciation Potential</h3>
                <p>Property values in Sainikpuri have shown consistent growth of 12-15% annually, making it an excellent investment opportunity.</p>
                
                <p><strong>KMK Homes</strong> offers ultra-luxury triplex villas in Sainikpuri with premium amenities, elegant architecture, and world-class construction quality. Established since 2009, we've been delivering dream homes to satisfied families across Hyderabad.</p>
            """,
            "featured_image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
            "category": "Luxury Villas",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=5),
            "tags": ["Sainikpuri Villas", "Luxury Villas Hyderabad", "Real Estate Investment", "KMK Homes"],
            "meta_title": "Top 5 Reasons to Invest in Sainikpuri Villas | KMK Homes Hyderabad",
            "meta_description": "Discover why Sainikpuri is the hottest luxury villa destination in Hyderabad. Strategic location, premium schools, healthcare, IT proximity & high ROI.",
            "meta_keywords": "Sainikpuri villas, luxury villas Hyderabad, Sainikpuri real estate, KMK Homes, villa investment Hyderabad",
            "featured": True,
            "active": True,
            "views": 245,
            "display_order": 1
        },
        {
            "title": "Why Triplex Villas Are the Future of Luxury Living in Hyderabad",
            "slug": "triplex-villas-future-luxury-living-hyderabad",
            "excerpt": "Explore the architectural marvel and lifestyle benefits of triplex villas that are redefining premium living in Hyderabad.",
            "content": """
                <h2>The Rise of Triplex Villas in Hyderabad</h2>
                <p>Triplex villas represent the pinnacle of luxury living, offering unparalleled space, privacy, and architectural grandeur. As Hyderabad's affluent population grows, so does the demand for homes that reflect success and sophistication.</p>
                
                <h3>What Makes Triplex Villas Special?</h3>
                <p>A triplex villa spans three levels, typically featuring:</p>
                <ul>
                    <li>Ground floor with spacious living areas, modern kitchen, and guest bedroom</li>
                    <li>First floor with master bedrooms and private balconies</li>
                    <li>Top floor with entertainment spaces, terrace gardens, and panoramic views</li>
                </ul>
                
                <h3>Architectural Excellence</h3>
                <p>Modern triplex villas combine contemporary design with functional luxury. High ceilings, natural lighting, premium flooring, and smart home integration create an unmatched living experience.</p>
                
                <h3>Privacy and Space</h3>
                <p>Unlike apartments, triplex villas offer complete privacy with no shared walls. Each level serves a distinct purpose, ensuring optimal space utilization for large families.</p>
                
                <h3>Investment Value</h3>
                <p>Triplex villas in prime Hyderabad locations have shown property appreciation of 15-18% annually, outperforming traditional apartments and independent houses.</p>
                
                <h3>KMK Homes Triplex Villa Collection</h3>
                <p>At <strong>KMK Homes</strong>, we specialize in ultra-luxury triplex villas with:</p>
                <ul>
                    <li>4000-6000 sq.ft built-up areas</li>
                    <li>Premium imported fittings and fixtures</li>
                    <li>Private landscaped gardens</li>
                    <li>Smart home automation</li>
                    <li>24/7 security and power backup</li>
                </ul>
            """,
            "featured_image": "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
            "category": "Luxury Villas",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=10),
            "tags": ["Triplex Villas", "Luxury Homes Hyderabad", "Villa Architecture", "Premium Properties"],
            "meta_title": "Why Triplex Villas Are the Future of Luxury Living | KMK Homes",
            "meta_description": "Discover why triplex villas are redefining luxury in Hyderabad. Architectural excellence, privacy, space & investment value by KMK Homes.",
            "meta_keywords": "triplex villas Hyderabad, luxury triplex homes, KMK Homes triplex, premium villas Hyderabad",
            "featured": True,
            "active": True,
            "views": 189,
            "display_order": 2
        },
        {
            "title": "Best Areas in Hyderabad to Buy Plots in 2025",
            "slug": "best-areas-hyderabad-buy-plots-2025",
            "excerpt": "Expert analysis of Hyderabad's most promising locations for plot investments in 2025 with ROI projections and infrastructure insights.",
            "content": """
                <h2>Hyderabad's Hottest Plot Investment Zones for 2025</h2>
                <p>Hyderabad's real estate market continues to boom, with plot investments offering some of the best returns. Here's our expert guide to the most promising locations for 2025.</p>
                
                <h3>1. Gachibowli - The IT Hub</h3>
                <p><strong>Average Plot Price:</strong> ₹25,000 - ₹40,000 per sq.yd</p>
                <p>Gachibowli's proximity to major IT companies makes it ideal for professionals. Expected appreciation: 18-20% annually.</p>
                
                <h3>2. Kokapet - Emerging Luxury Corridor</h3>
                <p><strong>Average Plot Price:</strong> ₹20,000 - ₹35,000 per sq.yd</p>
                <p>With the Telangana Secretariat nearby and excellent infrastructure, Kokapet is perfect for luxury villa construction.</p>
                
                <h3>3. Narsingi - Value for Money</h3>
                <p><strong>Average Plot Price:</strong> ₹15,000 - ₹25,000 per sq.yd</p>
                <p>Offering better prices than Gachibowli while maintaining proximity to IT hubs, Narsingi is ideal for smart investors.</p>
                
                <h3>4. Kollur - Budget-Friendly with High Growth</h3>
                <p><strong>Average Plot Price:</strong> ₹10,000 - ₹18,000 per sq.yd</p>
                <p>The Outer Ring Road connectivity and upcoming metro extension make Kollur a high-growth investment zone.</p>
                
                <h3>5. Sainikpuri - Established Premium Location</h3>
                <p><strong>Average Plot Price:</strong> ₹30,000 - ₹50,000 per sq.yd</p>
                <p>Already established with excellent amenities, Sainikpuri offers stability and consistent appreciation.</p>
                
                <h3>Key Investment Tips</h3>
                <ul>
                    <li>Verify RERA approval and clear titles</li>
                    <li>Check proximity to upcoming metro stations</li>
                    <li>Ensure gated community security</li>
                    <li>Consider water and electricity availability</li>
                </ul>
                
                <p><strong>KMK Homes</strong> offers RERA-approved premium plots in these prime locations with complete documentation support and construction services.</p>
            """,
            "featured_image": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200",
            "category": "Open Plots",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=3),
            "tags": ["Plots Hyderabad", "Real Estate Investment", "Gachibowli Plots", "Sainikpuri Plots", "Plot Investment 2025"],
            "meta_title": "Best Areas to Buy Plots in Hyderabad 2025 | KMK Homes Expert Guide",
            "meta_description": "Discover Hyderabad's best plot investment zones for 2025. Expert analysis of Gachibowli, Kokapet, Sainikpuri & more by KMK Homes.",
            "meta_keywords": "plots for sale Hyderabad, Gachibowli plots, Sainikpuri plots, real estate investment 2025, KMK Homes plots",
            "featured": True,
            "active": True,
            "views": 312,
            "display_order": 3
        },
        {
            "title": "KMK Homes: Redefining Real Estate Excellence in Telangana",
            "slug": "kmk-homes-redefining-real-estate-excellence-telangana",
            "excerpt": "The inspiring journey of KMK Homes from 2009 to becoming one of Hyderabad's most trusted luxury real estate brands.",
            "content": """
                <h2>Our Journey: Building Dreams Since 2009</h2>
                <p>Established in 2009, <strong>KMK Homes</strong> has grown from a vision of creating exceptional living spaces to becoming one of Hyderabad's most trusted names in luxury real estate.</p>
                
                <h3>Our Foundation: Trust & Quality</h3>
                <p>KMK Homes was founded on three core principles:</p>
                <ul>
                    <li><strong>Uncompromising Quality:</strong> Using only premium materials and construction techniques</li>
                    <li><strong>Timely Delivery:</strong> 100% on-time project completion record</li>
                    <li><strong>Customer Satisfaction:</strong> Post-handover support and transparent dealings</li>
                </ul>
                
                <h3>What Makes Us Different</h3>
                <p><strong>Classic Black & Gold Aesthetic:</strong> Our signature design philosophy reflects elegance, sophistication, and timeless luxury.</p>
                
                <p><strong>Comprehensive Services:</strong></p>
                <ul>
                    <li>Ultra-luxury triplex villas in prime locations</li>
                    <li>Budget-friendly elegant homes for growing families</li>
                    <li>Premium open plots with complete documentation</li>
                    <li>End-to-end construction management</li>
                    <li>Interior design and landscaping services</li>
                </ul>
                
                <h3>Our Signature Projects</h3>
                <p><strong>Sainikpuri Villa Collection:</strong> 50+ luxury villas delivered with 100% customer satisfaction</p>
                <p><strong>Gachibowli Estates:</strong> Premium gated community with world-class amenities</p>
                
                <h3>Awards & Recognition</h3>
                <ul>
                    <li>Best Luxury Villa Developer - Hyderabad 2023</li>
                    <li>Customer Choice Award - Real Estate 2022</li>
                    <li>Quality Excellence in Construction 2021</li>
                </ul>
                
                <h3>Our Promise</h3>
                <p>Every KMK Home comes with:</p>
                <ul>
                    <li>RERA approval and clear documentation</li>
                    <li>Premium imported fittings</li>
                    <li>5-year structural warranty</li>
                    <li>24/7 customer support</li>
                    <li>Flexible payment plans</li>
                </ul>
                
                <p>Join the KMK Homes family and experience the difference of living in a home built with passion, precision, and pride.</p>
            """,
            "featured_image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
            "category": "Market Insights",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=15),
            "tags": ["KMK Homes", "Real Estate Hyderabad", "Luxury Villas", "Company Profile", "Brand Story"],
            "meta_title": "KMK Homes: Redefining Real Estate Excellence in Telangana Since 2009",
            "meta_description": "Discover the inspiring journey of KMK Homes - Hyderabad's trusted luxury real estate brand since 2009. Quality, trust & customer satisfaction.",
            "meta_keywords": "KMK Homes, luxury villas Hyderabad, real estate Telangana, premium properties, trusted builder Hyderabad",
            "featured": False,
            "active": True,
            "views": 156,
            "display_order": 4
        },
        {
            "title": "Budget-Friendly Homes: Luxury Living for Every Family",
            "slug": "budget-friendly-homes-luxury-living-every-family",
            "excerpt": "How KMK Homes is making luxury accessible with elegantly designed budget homes without compromising on quality or amenities.",
            "content": """
                <h2>Luxury Doesn't Have to Break the Bank</h2>
                <p>At <strong>KMK Homes</strong>, we believe every family deserves a beautiful home. Our budget-friendly homes collection brings luxury living within reach.</p>
                
                <h3>What Are Budget Homes?</h3>
                <p>Our budget homes range from ₹50 lakhs to ₹90 lakhs, offering:</p>
                <ul>
                    <li>1200-1800 sq.ft built-up area</li>
                    <li>2-3 BHK configurations</li>
                    <li>Premium finishes and fittings</li>
                    <li>Modern amenities</li>
                    <li>Gated community security</li>
                </ul>
                
                <h3>No Compromise on Quality</h3>
                <p>Our budget homes feature:</p>
                <ul>
                    <li>Vitrified tile flooring</li>
                    <li>Modular kitchens</li>
                    <li>Premium bathroom fittings</li>
                    <li>Earthquake-resistant structure</li>
                    <li>Energy-efficient design</li>
                </ul>
                
                <h3>Smart Locations</h3>
                <p>We build budget homes in emerging areas with excellent growth potential:</p>
                <ul>
                    <li>Kompally - Near IT corridors</li>
                    <li>Bachupally - Excellent connectivity</li>
                    <li>Miyapur - Metro connectivity</li>
                    <li>Kollur - High appreciation zone</li>
                </ul>
                
                <h3>Flexible Payment Plans</h3>
                <p>KMK Homes offers:</p>
                <ul>
                    <li>20% down payment options</li>
                    <li>Construction-linked payment plans</li>
                    <li>Home loan assistance</li>
                    <li>No hidden charges</li>
                </ul>
                
                <h3>Community Amenities</h3>
                <p>Even our budget homes include:</p>
                <ul>
                    <li>Children's play area</li>
                    <li>24/7 security</li>
                    <li>Power backup</li>
                    <li>Water treatment plant</li>
                    <li>Landscaped gardens</li>
                </ul>
                
                <p>Make your dream home a reality with KMK Homes' budget-friendly luxury collection.</p>
            """,
            "featured_image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            "category": "Budget Homes",
            "author": "KMK Homes Team",
            "publish_date": datetime.utcnow() - timedelta(days=7),
            "tags": ["Budget Homes", "Affordable Villas Hyderabad", "KMK Homes Budget", "Family Homes"],
            "meta_title": "Budget-Friendly Homes: Luxury Living for Every Family | KMK Homes",
            "meta_description": "Discover KMK Homes' budget-friendly luxury homes from ₹50L. Premium quality, modern amenities & smart locations in Hyderabad.",
            "meta_keywords": "budget homes Hyderabad, affordable villas, KMK Homes budget, family homes Hyderabad, budget-friendly luxury",
            "featured": False,
            "active": True,
            "views": 201,
            "display_order": 5
        }
    ]
    
    # Clear existing blogs (optional)
    print("Clearing existing blog posts...")
    # You can uncomment this if you want to clear existing data
    # await blogs_db.collection.delete_many({})
    
    # Insert sample blogs
    print("Inserting sample blog posts...")
    for blog in sample_blogs:
        blog_id = await blogs_db.create(blog)
        print(f"Created blog: {blog['title']} (ID: {blog_id})")
    
    print(f"\n✅ Successfully seeded {len(sample_blogs)} blog posts!")

if __name__ == "__main__":
    asyncio.run(seed_blogs())
