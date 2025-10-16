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
  
  // Budget Homes
  getBudgetHomes: (params = {}) => api.get('/budget-homes', { params }),
  getBudgetHome: (id) => api.get(`/budget-homes/${id}`),
  
  // Plots
  getPlots: (params = {}) => api.get('/plots', { params }),
  getPlot: (id) => api.get(`/plots/${id}`),
  
  // Blogs
  getBlogs: (params = {}) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getBlogCategories: () => api.get('/blogs/categories/all'),
};

// Admin API calls (requires authentication)
export const adminApi = {
  // Auth
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getCurrentUser: () => api.get('/admin/auth/me'),
  changePassword: (data) => api.post('/admin/auth/change-password', data),
  
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

  // Happy Clients
  getHappyClients: () => api.get('/admin/happy-clients'),
  createHappyClient: (data) => api.post('/admin/happy-clients', data),
  updateHappyClient: (id, data) => api.put(`/admin/happy-clients/${id}`, data),
  deleteHappyClient: (id) => api.delete(`/admin/happy-clients/${id}`),

  // News & Events
  getNewsEvents: () => api.get('/admin/news-events'),
  createNewsEvent: (data) => api.post('/admin/news-events', data),
  updateNewsEvent: (id, data) => api.put(`/admin/news-events/${id}`, data),
  deleteNewsEvent: (id) => api.delete(`/admin/news-events/${id}`),

  // NRI Corner
  getNRIContent: () => api.get('/admin/nri-content'),
  createNRIContent: (data) => api.post('/admin/nri-content', data),
  updateNRIContent: (id, data) => api.put(`/admin/nri-content/${id}`, data),
  deleteNRIContent: (id) => api.delete(`/admin/nri-content/${id}`),

  // Amenities
  getAmenities: () => api.get('/admin/amenities'),
  createAmenity: (data) => api.post('/admin/amenities', data),
  updateAmenity: (id, data) => api.put(`/admin/amenities/${id}`, data),
  deleteAmenity: (id) => api.delete(`/admin/amenities/${id}`),
  
  // Fetch Nearby Places
  fetchNearbyPlaces: (location) => api.post('/admin/fetch-nearby-places', null, { params: { location } }),
  
  // Budget Homes
  getBudgetHomes: () => api.get('/admin/budget-homes'),
  createBudgetHome: (data) => api.post('/admin/budget-homes', data),
  updateBudgetHome: (id, data) => api.put(`/admin/budget-homes/${id}`, data),
  deleteBudgetHome: (id) => api.delete(`/admin/budget-homes/${id}`),
  
  // Plots
  getPlots: () => api.get('/admin/plots'),
  createPlot: (data) => api.post('/admin/plots', data),
  updatePlot: (id, data) => api.put(`/admin/plots/${id}`, data),
  deletePlot: (id) => api.delete(`/admin/plots/${id}`),
  
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