import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Home as HomeIcon,
  Save,
  X,
  Upload,
  Eye,
  Play,
  MapPin,
  Building
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminBudgetHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHome, setEditingHome] = useState(null);
  const [formData, setFormData] = useState({
    project_name: '',
    location: '',
    price_range: 'Affordable',
    property_type: 'Apartment',
    short_description: '',
    thumbnail_image: '',
    youtube_link: '',
    builder_name: '',
    featured: false,
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await adminApi.getBudgetHomes();
      setHomes(response.data || []);
    } catch (error) {
      console.error('Error fetching budget homes:', error);
      setHomes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingHome) {
        await adminApi.updateBudgetHome(editingHome._id, formData);
      } else {
        await adminApi.createBudgetHome(formData);
      }

      await fetchHomes();
      resetForm();
    } catch (error) {
      console.error('Error saving budget home:', error);
      alert('Error saving home listing. Please try again.');
    }
  };

  const handleDelete = async (homeId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await adminApi.deleteBudgetHome(homeId);
        await fetchHomes();
      } catch (error) {
        console.error('Error deleting home:', error);
        alert('Error deleting listing. Please try again.');
      }
    }
  };

  const handleEdit = (home) => {
    setEditingHome(home);
    setFormData({
      project_name: home.project_name,
      location: home.location,
      price_range: home.price_range,
      property_type: home.property_type,
      short_description: home.short_description,
      thumbnail_image: home.thumbnail_image,
      youtube_link: home.youtube_link || '',
      builder_name: home.builder_name,
      featured: home.featured,
      display_order: home.display_order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      location: '',
      price_range: 'Affordable',
      property_type: 'Apartment',
      short_description: '',
      thumbnail_image: '',
      youtube_link: '',
      builder_name: '',
      featured: false,
      display_order: 1
    });
    setEditingHome(null);
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
    return <div className="flex items-center justify-center h-64">Loading budget homes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homes for Every Budget</h1>
          <p className="text-gray-600 mt-2">Manage curated listings from partner builders</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Listing
        </Button>
      </div>

      {/* Home Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingHome ? 'Edit Listing' : 'Add New Listing'}
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
                    placeholder="e.g., Green Valley Apartments"
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
                    placeholder="e.g., Kondapur, Hyderabad"
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
                    Builder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.builder_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, builder_name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., ABC Developers (Internal use only)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Note: Builder name is not displayed on the website</p>
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

                <div className="md:col-span-2">
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
                  Featured Listing
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
                  {editingHome ? 'Update Listing' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Homes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <Card key={home._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={home.thumbnail_image}
                alt={home.project_name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 space-x-2">
                <Badge className={`${
                  home.price_range === 'Affordable' ? 'bg-green-500' :
                  home.price_range === 'Mid-range' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  {home.price_range}
                </Badge>
                <Badge variant="outline" className="bg-white/90">
                  {home.property_type}
                </Badge>
              </div>
              
              {home.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  Featured
                </Badge>
              )}

              {home.youtube_link && (
                <Button
                  onClick={() => openYouTube(home.youtube_link)}
                  size="sm"
                  className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Play size={12} className="mr-1" />
                  Tour
                </Button>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-kmk-navy mb-2">{home.project_name}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{home.location}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {home.short_description}
              </p>

              <div className="text-xs text-gray-500 mb-2">
                <Building size={12} className="inline mr-1" />
                Builder: {home.builder_name}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Order: {home.display_order}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(home)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(home._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </Button>
                {home.youtube_link && (
                  <Button
                    onClick={() => openYouTube(home.youtube_link)}
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

      {homes.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <HomeIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Listings Yet</h3>
            <p className="text-gray-500 mb-6">Add your first curated listing from partner builders.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBudgetHomes;