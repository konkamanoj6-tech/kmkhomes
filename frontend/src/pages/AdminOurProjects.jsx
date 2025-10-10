import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  Save,
  X,
  Upload,
  Eye,
  Play,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminOurProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    project_name: '',
    location: '',
    status: 'Available',
    plot_size: '',
    built_up_area: '',
    facing: 'East',
    price: '',
    price_range: 'Mid-range',
    property_type: 'Villa',
    description: '',
    thumbnail_image: '',
    gallery_images: [],
    amenities: [],
    youtube_link: '',
    enquiry_link: '',
    map_link: '',
    featured: false,
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminApi.getOurProjects();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching our projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        plot_size: formData.plot_size ? parseInt(formData.plot_size) : null,
        built_up_area: formData.built_up_area ? parseInt(formData.built_up_area) : null
      };

      if (editingProject) {
        await adminApi.updateOurProject(editingProject._id, submitData);
      } else {
        await adminApi.createOurProject(submitData);
      }

      await fetchProjects();
      resetForm();
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving our project:', error);
      alert('Error saving project: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await adminApi.deleteOurProject(projectId);
        await fetchProjects();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name,
      location: project.location,
      status: project.status,
      plot_size: project.plot_size || '',
      built_up_area: project.built_up_area || '',
      facing: project.facing || 'East',
      price: project.price || '',
      price_range: project.price_range,
      property_type: project.property_type,
      description: project.description,
      thumbnail_image: project.thumbnail_image,
      gallery_images: project.gallery_images || [],
      amenities: project.amenities || [],
      youtube_link: project.youtube_link || '',
      enquiry_link: project.enquiry_link || '',
      map_link: project.map_link || '',
      featured: project.featured,
      display_order: project.display_order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      location: '',
      status: 'Available',
      plot_size: '',
      built_up_area: '',
      facing: 'East',
      price: '',
      price_range: 'Mid-range',
      property_type: 'Villa',
      description: '',
      thumbnail_image: '',
      gallery_images: [],
      amenities: [],
      youtube_link: '',
      enquiry_link: '',
      map_link: '',
      featured: false,
      display_order: 1
    });
    setEditingProject(null);
    setShowForm(false);
    setNewAmenity('');
    setNewGalleryImage('');
  };

  const handleImageUpload = async (e, fieldName = 'thumbnail_image') => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await adminApi.uploadFile(file);
      const imageUrl = response.data.file_url;
      
      if (fieldName === 'thumbnail_image') {
        setFormData(prev => ({
          ...prev,
          thumbnail_image: imageUrl
        }));
      }
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
    }
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    return `${backendUrl}${imageUrl}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading our projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Projects</h1>
          <p className="text-gray-600 mt-2">Manage KMK Homes in-house projects with full details</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
              <Button onClick={resetForm} variant="outline" size="sm">
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.project_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="e.g., Royal Gardens Phase II"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="e.g., Gachibowli, Hyderabad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold Out">Sold Out</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="e.g., ₹2.5 Cr or ₹50 Lakhs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range *
                    </label>
                    <select
                      required
                      value={formData.price_range}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    >
                      <option value="Affordable">Affordable</option>
                      <option value="Mid-range">Mid-range</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      required
                      value={formData.property_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facing
                    </label>
                    <select
                      value={formData.facing}
                      onChange={(e) => setFormData(prev => ({ ...prev, facing: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    >
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="South-East">South-East</option>
                      <option value="North-East">North-East</option>
                      <option value="South-West">South-West</option>
                      <option value="North-West">North-West</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plot Size (Sq. Yards)
                    </label>
                    <input
                      type="number"
                      value={formData.plot_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, plot_size: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="e.g., 300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Built-up Area (Sq. Feet)
                    </label>
                    <input
                      type="number"
                      value={formData.built_up_area}
                      onChange={(e) => setFormData(prev => ({ ...prev, built_up_area: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="e.g., 2700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Detailed description of the project..."
                />
              </div>

              {/* Images */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Images</h3>
                
                {/* Thumbnail */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image * (Max 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
                  />
                  {uploading && <p className="text-sm text-blue-600">Uploading image...</p>}
                  
                  {formData.thumbnail_image && (
                    <div className="relative mt-2">
                      <img
                        src={getImageUrl(formData.thumbnail_image)}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail_image: '' }))}
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        <Trash2 size={12} />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 break-all">{formData.thumbnail_image}</p>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images (Enter full URL)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={newGalleryImage}
                      onChange={(e) => setNewGalleryImage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" onClick={addGalleryImage} variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.gallery_images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImageUrl(img)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Error';
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 p-1 h-6 w-6"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Swimming Pool"
                  />
                  <Button type="button" onClick={addAmenity} variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      value={formData.youtube_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtube_link: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enquiry Link (WhatsApp/Contact)
                    </label>
                    <input
                      type="url"
                      value={formData.enquiry_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, enquiry_link: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps Link
                    </label>
                    <input
                      type="url"
                      value={formData.map_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, map_link: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-kmk-gold focus:ring-kmk-gold"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Project (Show on homepage)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-kmk-navy hover:bg-kmk-navy/90"
                  disabled={uploading}
                >
                  <Save size={16} className="mr-2" />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={getImageUrl(project.thumbnail_image)}
                alt={project.project_name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="absolute top-3 left-3 space-x-2">
                <Badge className={`${
                  project.status === 'Available' ? 'bg-green-500' :
                  project.status === 'Sold Out' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}>
                  {project.status}
                </Badge>
                <Badge className={`${
                  project.price_range === 'Affordable' ? 'bg-green-500' :
                  project.price_range === 'Mid-range' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  {project.price_range}
                </Badge>
              </div>
              
              {project.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-kmk-navy mb-2">{project.project_name}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{project.location}</span>
              </div>

              {(project.plot_size || project.built_up_area) && (
                <div className="text-sm text-gray-600 mb-3">
                  {project.plot_size && <div>Plot: {project.plot_size} Sq.Yds</div>}
                  {project.built_up_area && <div>Built-up: {project.built_up_area} Sq.Ft</div>}
                </div>
              )}

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              {project.amenities && project.amenities.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Amenities: {project.amenities.length}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(project)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(project._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">Add your first in-house project to showcase KMK Homes portfolio.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOurProjects;
