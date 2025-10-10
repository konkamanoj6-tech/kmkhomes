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
  MapPin
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
    price_range: 'Mid-range',
    property_type: 'Villa',
    short_description: '',
    thumbnail_image: '',
    youtube_link: '',
    featured: false,
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);

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
      if (editingProject) {
        await adminApi.updateOurProject(editingProject._id, formData);
      } else {
        await adminApi.createOurProject(formData);
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving our project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await adminApi.deleteOurProject(projectId);
        await fetchProjects();
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
      price_range: project.price_range,
      property_type: project.property_type,
      short_description: project.short_description,
      thumbnail_image: project.thumbnail_image,
      youtube_link: project.youtube_link || '',
      featured: project.featured,
      display_order: project.display_order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      location: '',
      price_range: 'Mid-range',
      property_type: 'Villa',
      short_description: '',
      thumbnail_image: '',
      youtube_link: '',
      featured: false,
      display_order: 1
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminApi.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        thumbnail_image: response.data.file_url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openYouTube = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
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
          <p className="text-gray-600 mt-2">Manage KMK Homes in-house projects</p>
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
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Thumbnail *
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  {uploading && <p className="text-sm text-gray-600">Uploading image...</p>}
                  
                  {formData.thumbnail_image && (
                    <div className="relative">
                      <img
                        src={formData.thumbnail_image}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg"
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
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Brief description of the project..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-kmk-gold focus:ring-kmk-gold"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Project
                </label>
              </div>

              <div className="flex justify-end space-x-4">
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
                src={project.thumbnail_image}
                alt={project.project_name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 space-x-2">
                <Badge className={`${
                  project.price_range === 'Affordable' ? 'bg-green-500' :
                  project.price_range === 'Mid-range' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  {project.price_range}
                </Badge>
                <Badge variant="outline" className="bg-white/90">
                  {project.property_type}
                </Badge>
              </div>
              
              {project.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  Featured
                </Badge>
              )}

              {project.youtube_link && (
                <Button
                  onClick={() => openYouTube(project.youtube_link)}
                  size="sm"
                  className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Play size={12} className="mr-1" />
                  Tour
                </Button>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-kmk-navy mb-2">{project.project_name}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{project.location}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.short_description}
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Order: {project.display_order}
              </div>

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
                {project.youtube_link && (
                  <Button
                    onClick={() => openYouTube(project.youtube_link)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye size={12} />
                  </Button>
                )}
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