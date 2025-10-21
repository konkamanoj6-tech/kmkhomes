// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads/, construct full URL
  if (imageUrl.startsWith('/uploads/')) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    return backendUrl ? `${backendUrl}${imageUrl}` : imageUrl;
  }
  
  // For any other relative path, assume it's an upload
  if (imageUrl.startsWith('/')) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    return backendUrl ? `${backendUrl}${imageUrl}` : imageUrl;
  }
  
  // If none of the above, return as is
  return imageUrl;
};