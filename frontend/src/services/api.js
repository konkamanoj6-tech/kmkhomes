import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API calls (no auth required)
export const publicApi = {
  // Properties
  getProperties: (params = {}) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  
  // Home content
  getHomeBanners: () => api.get('/home-banners'),
  getTestimonials: (params = {}) => api.get('/testimonials', { params }),
  
  // Other content
  getAboutSections: () => api.get('/about-sections'),
  getTeamMembers: () => api.get('/team-members'),
  getAmenities: () => api.get('/amenities'),
  getUpcomingProjects: () => api.get('/upcoming-projects'),
  getNewsEvents: (params = {}) => api.get('/news-events', { params }),
  getNRIContent: (params = {}) => api.get('/nri-content', { params }),
  getContactInfo: () => api.get('/contact-info'),
  
  // Contact form
  submitContactForm: (data) => api.post('/contact-form', data),
};

// Admin API calls (requires authentication)
export const adminApi = {
  // Auth
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getCurrentUser: () => api.get('/admin/auth/me'),
  
  // Properties
  getProperties: () => api.get('/admin/properties'),
  createProperty: (data) => api.post('/admin/properties', data),
  updateProperty: (id, data) => api.put(`/admin/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/admin/properties/${id}`),
  
  // Home Banners
  getBanners: () => api.get('/admin/home-banners'),
  createBanner: (data) => api.post('/admin/home-banners', data),
  updateBanner: (id, data) => api.put(`/admin/home-banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/home-banners/${id}`),
  
  // Testimonials
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),
  
  // Contact Info
  getContactInfo: () => api.get('/admin/contact-info'),
  updateContactInfo: (data) => api.put('/admin/contact-info', data),
  
  // Contact Submissions
  getContactSubmissions: () => api.get('/admin/contact-submissions'),
  
  // File Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;