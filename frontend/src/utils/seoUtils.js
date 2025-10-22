/**
 * SEO Utility Functions for KMK Homes
 * Generates Schema.org structured data for better search engine visibility
 */

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KMK Homes",
    "alternateName": "KMK Homes Hyderabad",
    "description": "KMK Homes is a Hyderabad-based real estate developer offering luxury villas, budget homes, and verified open plots from trusted builders.",
    "url": window.location.origin,
    "logo": `${window.location.origin}/kmk-logo.jpeg`,
    "image": `${window.location.origin}/kmk-logo.jpeg`,
    "telephone": "+919014060147",
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
    "founder": {
      "@type": "Person",
      "name": "KMK Homes"
    },
    "foundingDate": "2009",
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
      title: "KMK Homes – Luxury Villas, Budget Homes & Verified Plots in Hyderabad",
      description: "KMK Homes is a trusted real estate developer in Hyderabad, building luxury villas, budget-friendly homes, and verified plots across prime locations like Sainikpuri and Gachibowli.",
      keywords: "KMK Homes, Luxury Villas Hyderabad, Budget Homes Hyderabad, Plots for Sale Hyderabad, Real Estate Developers Hyderabad"
    },
    projects: {
      title: "Luxury Villas in Hyderabad | Premium Properties | KMK Homes",
      description: "Explore KMK Homes' ultra-luxury triplex villas with world-class amenities in prime Hyderabad locations. 4000-6000 sq.ft premium properties in Sainikpuri and Gachibowli.",
      keywords: "luxury villas Hyderabad, triplex villas, premium properties, KMK Homes projects, Sainikpuri villas, Gachibowli villas"
    },
    budgetHomes: {
      title: "Budget Homes in Hyderabad | Affordable Luxury Villas | KMK Homes",
      description: "Budget-friendly luxury homes from ₹50L. Elegant 2-3 BHK homes with premium amenities in emerging Hyderabad locations. Quality homes at affordable prices.",
      keywords: "budget homes Hyderabad, affordable villas, KMK Homes budget, family homes, budget-friendly luxury, 2BHK 3BHK Hyderabad"
    },
    plots: {
      title: "Open Plots for Sale in Hyderabad | RERA Approved Plots | KMK Homes",
      description: "RERA-approved premium open plots in Gachibowli, Sainikpuri & prime Hyderabad locations. Complete documentation support. Verified plots from trusted builders.",
      keywords: "open plots Hyderabad, plots for sale, Gachibowli plots, Sainikpuri plots, RERA approved plots, verified plots Hyderabad"
    },
    about: {
      title: "About KMK Homes | Trusted Real Estate Builder Since 2009 | Hyderabad",
      description: "Learn about KMK Homes - Hyderabad's trusted luxury real estate brand. 15+ years of excellence in villa construction and customer satisfaction. Building dreams since 2009.",
      keywords: "KMK Homes, about us, real estate Hyderabad, trusted builder, luxury villas, real estate developer"
    },
    contact: {
      title: "Contact KMK Homes | Book Site Visit | Hyderabad Real Estate",
      description: "Get in touch with KMK Homes for luxury villas, budget homes & plots in Hyderabad. Call +91 9791662929 or WhatsApp +91 9014060147 to schedule a site visit.",
      keywords: "contact KMK Homes, site visit, luxury villas Hyderabad, property inquiry, KMK Homes Hyderabad contact"
    },
    blog: {
      title: "KMK Insights | Real Estate Blog | Property Investment Tips Hyderabad",
      description: "Expert insights on Hyderabad real estate, villa investments, plot buying guides & market trends by KMK Homes. Latest property news and investment advice.",
      keywords: "real estate blog, Hyderabad property, investment tips, villa buying guide, KMK Insights, property news Hyderabad"
    }
  };

  return metaTags[page] || metaTags.home;
};
