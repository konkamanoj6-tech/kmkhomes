/**
 * Google Analytics 4 & Search Console Integration for KMK Homes
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace 'G-XXXXXXXXXX' with your actual Google Analytics 4 Measurement ID
 * 2. Replace 'google-site-verification-code' with your actual Search Console verification code
 * 3. Uncomment the script tags in index.html to activate
 */

// Google Analytics 4 Configuration
export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual GA4 ID

// Google Search Console Verification
export const GSC_VERIFICATION_CODE = 'google-site-verification-code'; // TODO: Replace with actual code

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Predefined event trackers for KMK Homes
export const trackPropertyView = (propertyId, propertyName) => {
  trackEvent('view_property', {
    property_id: propertyId,
    property_name: propertyName,
  });
};

export const trackContactFormSubmit = (formType) => {
  trackEvent('contact_form_submit', {
    form_type: formType,
  });
};

export const trackSiteVisitBooking = () => {
  trackEvent('site_visit_booking');
};

export const trackBlogView = (blogId, blogTitle) => {
  trackEvent('view_blog', {
    blog_id: blogId,
    blog_title: blogTitle,
  });
};

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click');
};

export const trackCallClick = () => {
  trackEvent('call_click');
};
