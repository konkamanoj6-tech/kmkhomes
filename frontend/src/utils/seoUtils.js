/**
 * SEO Utility Functions for KMK Homes
 * Generates Schema.org structured data for better search engine visibility
 */

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "KMK Homes",
    "description": "Luxury villas, budget homes & premium plots in Hyderabad since 2009",
    "url": window.location.origin,
    "logo": `${window.location.origin}/kmk-logo.jpeg`,
    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    "telephone": "+919791662929",
    "email": "homeskmk3@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sainikpuri",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500094",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "17.385044",
      "longitude": "78.486671"
    },
    "areaServed": {
      "@type": "City",
      "name": "Hyderabad"
    },
    "priceRange": "₹₹₹",
    "sameAs": [
      "https://www.facebook.com/kmkhomes",
      "https://www.instagram.com/kmkhomes",
      "https://www.linkedin.com/company/kmkhomes"
    ]
  };
};

export const generatePropertySchema = (property) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.villa_number || property.property_name || property.plot_name,
    "description": property.description,
    "image": property.main_image || (property.gallery_images && property.gallery_images[0]),
    "brand": {
      "@type": "Brand",
      "name": "KMK Homes"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": property.price_range,
      "availability": property.status === "Available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "KMK Homes"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Location",
        "value": property.location
      },
      {
        "@type": "PropertyValue",
        "name": "Facing",
        "value": property.facing
      }
    ]
  };
};

export const generateBlogPostSchema = (blog) => {
  const publishDate = blog.publish_date ? new Date(blog.publish_date).toISOString() : new Date().toISOString();
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.featured_image,
    "author": {
      "@type": "Organization",
      "name": blog.author || "KMK Homes Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KMK Homes",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/kmk-logo.jpeg`
      }
    },
    "datePublished": publishDate,
    "dateModified": blog.updated_at ? new Date(blog.updated_at).toISOString() : publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "keywords": blog.tags ? blog.tags.join(', ') : "",
    "articleSection": blog.category
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generatePlaceSchema = (property) => {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": property.villa_number || property.property_name || property.plot_name,
    "description": property.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "geo": property.latitude && property.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    } : null,
    "amenityFeature": property.amenities ? property.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) : []
  };
};

// Generate meta tags for dynamic pages
export const generateMetaTags = (page, data = {}) => {
  const metaTags = {
    home: {
      title: "KMK Homes | Luxury Villas & Premium Real Estate in Hyderabad",
      description: "KMK Homes - Building dream homes since 2009. Ultra-luxury triplex villas, budget homes & premium plots in Sainikpuri, Gachibowli, Hyderabad.",
      keywords: "luxury villas Hyderabad, KMK Homes, Sainikpuri villas, triplex villas, Gachibowli properties, premium real estate"
    },
    projects: {
      title: "Our Projects | Luxury Villas in Hyderabad | KMK Homes",
      description: "Explore KMK Homes' ultra-luxury triplex villas with world-class amenities in prime Hyderabad locations. 4000-6000 sq.ft premium properties.",
      keywords: "luxury villas Hyderabad, triplex villas, premium properties, KMK Homes projects, Sainikpuri villas"
    },
    budgetHomes: {
      title: "Homes for Every Budget | Affordable Luxury Villas | KMK Homes",
      description: "Budget-friendly luxury homes from ₹50L. Elegant 2-3 BHK homes with premium amenities in emerging Hyderabad locations.",
      keywords: "budget homes Hyderabad, affordable villas, KMK Homes budget, family homes, budget-friendly luxury"
    },
    plots: {
      title: "Open Plots for Sale in Hyderabad | Premium Plots | KMK Homes",
      description: "RERA-approved premium open plots in Gachibowli, Sainikpuri & prime Hyderabad locations. Complete documentation support.",
      keywords: "open plots Hyderabad, plots for sale, Gachibowli plots, Sainikpuri plots, RERA approved plots"
    },
    about: {
      title: "About KMK Homes | Trusted Real Estate Builder Since 2009",
      description: "Learn about KMK Homes - Hyderabad's trusted luxury real estate brand. 15+ years of excellence in villa construction and customer satisfaction.",
      keywords: "KMK Homes, about us, real estate Hyderabad, trusted builder, luxury villas"
    },
    contact: {
      title: "Contact KMK Homes | Book Site Visit | Hyderabad",
      description: "Get in touch with KMK Homes for luxury villas, budget homes & plots in Hyderabad. Call +91 9791662929 or schedule a site visit.",
      keywords: "contact KMK Homes, site visit, luxury villas Hyderabad, property inquiry"
    },
    blog: {
      title: "KMK Insights | Real Estate Blog | Property Investment Tips",
      description: "Expert insights on Hyderabad real estate, villa investments, plot buying guides & market trends by KMK Homes.",
      keywords: "real estate blog, Hyderabad property, investment tips, villa buying guide, KMK Insights"
    }
  };

  return metaTags[page] || metaTags.home;
};
