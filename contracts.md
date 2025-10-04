# KMK Homes CMS Integration Contracts

## Overview
Convert the KMK Homes website to a fully dynamic, CMS-powered platform where ALL content is editable without coding.

## Backend Collections/Models

### 1. Properties Collection
```javascript
{
  id: ObjectId,
  villa_number: String,
  status: String, // "Available", "Sold Out", "Coming Soon"
  plot_size: Number, // Sq. Yds
  built_up_area: Number, // Sq. Ft
  facing: String, // "East", "West", "North", "South-East"
  location: String,
  price_range: String,
  gallery_images: [String], // Array of image URLs
  description: String,
  amenities: [String], // Array of amenity names
  enquiry_link: String, // WhatsApp link
  map_link: String, // Google Maps link
  featured: Boolean, // Show on homepage
  created_at: Date,
  updated_at: Date
}
```

### 2. Home Banners Collection
```javascript
{
  id: ObjectId,
  title: String,
  subtitle: String,
  image_url: String,
  cta_text: String,
  cta_link: String,
  active: Boolean,
  display_order: Number,
  created_at: Date
}
```

### 3. About Us Collection
```javascript
{
  id: ObjectId,
  section_name: String, // "company_story", "mission", "vision"
  title: String,
  content: String, // Rich text/HTML
  image_url: String,
  active: Boolean,
  display_order: Number,
  updated_at: Date
}
```

### 4. Team Members Collection
```javascript
{
  id: ObjectId,
  name: String,
  position: String,
  bio: String,
  image_url: String,
  display_order: Number,
  active: Boolean,
  created_at: Date
}
```

### 5. Amenities Collection
```javascript
{
  id: ObjectId,
  title: String,
  description: String,
  icon_name: String, // Lucide icon name
  image_url: String,
  active: Boolean,
  display_order: Number,
  created_at: Date
}
```

### 6. Upcoming Projects Collection
```javascript
{
  id: ObjectId,
  title: String,
  description: String,
  launch_date: Date,
  location: String,
  image_url: String,
  features: [String],
  early_access_link: String,
  active: Boolean,
  created_at: Date
}
```

### 7. Testimonials Collection
```javascript
{
  id: ObjectId,
  name: String,
  location: String,
  testimonial: String,
  image_url: String,
  rating: Number, // 1-5
  featured: Boolean, // Show on homepage
  display_order: Number,
  active: Boolean,
  created_at: Date
}
```

### 8. News & Events Collection
```javascript
{
  id: ObjectId,
  title: String,
  excerpt: String,
  content: String, // Rich text/HTML
  image_url: String,
  category: String, // "News", "Events", "Projects", "Awards"
  author: String,
  publish_date: Date,
  event_date: Date, // For events
  featured: Boolean,
  active: Boolean,
  created_at: Date
}
```

### 9. NRI Content Collection
```javascript
{
  id: ObjectId,
  section_name: String, // "services", "benefits", "process", "legal"
  title: String,
  content: String,
  icon_name: String,
  image_url: String,
  display_order: Number,
  active: Boolean,
  updated_at: Date
}
```

### 10. Contact Info Collection
```javascript
{
  id: ObjectId,
  company_name: String,
  phone: String,
  email: String,
  whatsapp: String,
  address: String,
  map_embed_url: String,
  business_hours: String,
  updated_at: Date
}
```

### 11. Site Settings Collection
```javascript
{
  id: ObjectId,
  setting_key: String, // "footer_about", "social_links", "seo_meta"
  setting_value: String, // JSON or text
  updated_at: Date
}
```

### 12. Admin Users Collection
```javascript
{
  id: ObjectId,
  username: String,
  email: String,
  password_hash: String,
  role: String, // "admin", "editor"
  active: Boolean,
  created_at: Date
}
```

## Backend API Endpoints

### Public API (Frontend)
- GET /api/properties - Get all properties with filters
- GET /api/properties/:id - Get single property
- GET /api/home-banners - Get active banners
- GET /api/about-sections - Get about us content
- GET /api/team-members - Get team members
- GET /api/amenities - Get amenities
- GET /api/upcoming-projects - Get upcoming projects
- GET /api/testimonials - Get testimonials
- GET /api/news - Get news/events with pagination
- GET /api/nri-content - Get NRI content sections
- GET /api/contact-info - Get contact information
- GET /api/site-settings/:key - Get site settings
- POST /api/contact-form - Submit contact form

### Admin API (CMS)
- POST /api/admin/auth/login - Admin login
- GET /api/admin/auth/me - Get current admin user
- CRUD operations for all collections:
  - GET/POST/PUT/DELETE /api/admin/properties
  - GET/POST/PUT/DELETE /api/admin/home-banners
  - GET/POST/PUT/DELETE /api/admin/about-sections
  - GET/POST/PUT/DELETE /api/admin/team-members
  - GET/POST/PUT/DELETE /api/admin/amenities
  - GET/POST/PUT/DELETE /api/admin/upcoming-projects
  - GET/POST/PUT/DELETE /api/admin/testimonials
  - GET/POST/PUT/DELETE /api/admin/news
  - GET/POST/PUT/DELETE /api/admin/nri-content
  - PUT /api/admin/contact-info
  - PUT /api/admin/site-settings/:key
- POST /api/admin/upload - File upload for images

## Frontend Integration Changes

### Remove Mock Data
- Replace all static data from `mock.js` with API calls
- Create service functions for API communication
- Implement loading states and error handling

### Dynamic Content Loading
- Home page: Load banners, featured properties, testimonials dynamically
- Projects page: Load properties with filtering from API
- About page: Load company info and team from CMS
- Amenities page: Load amenities from CMS
- All pages: Load contact info and site settings dynamically

### Admin Interface
- Create `/admin` route with authentication
- Build CMS dashboard with:
  - Content management forms for all collections
  - Image upload functionality
  - WYSIWYG editor for rich text content
  - Drag & drop reordering for display order
  - Bulk actions (activate/deactivate, delete)
  - Preview functionality

## Implementation Plan

### Phase 1: Backend CMS API
1. Create all database models
2. Implement CRUD endpoints for all collections
3. Add authentication middleware for admin routes
4. Create image upload functionality
5. Add data validation and error handling

### Phase 2: Admin Interface
1. Create admin login page
2. Build CMS dashboard layout
3. Implement content management forms
4. Add image upload interface
5. Create rich text editor integration

### Phase 3: Frontend Integration
1. Replace mock data with API calls
2. Add loading states and error handling
3. Update all components to use dynamic content
4. Test all functionality end-to-end

### Phase 4: Data Migration
1. Create initial admin user
2. Migrate existing mock data to CMS
3. Test content editing workflow
4. Final testing and optimization

## Security Considerations
- JWT-based admin authentication
- Password hashing for admin users
- Input validation and sanitization
- File upload restrictions and validation
- CORS configuration for admin routes

## SEO & Performance
- Server-side rendering considerations
- Image optimization
- Meta tags management through CMS
- Caching strategies for frequently accessed content