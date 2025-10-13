import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Home,
  Compass,
  Image as ImageIcon,
  Youtube
} from 'lucide-react';
import { adminApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const AdminBudgetHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHome, setEditingHome] = useState(null);
  const [formData, setFormData] = useState({
    property_name: '',
    location: '',
    price_range: '',
    property_type: 'Villa',
    built_up_area: '',
    facing: 'East',
    description: '',
    main_image: '',
    gallery_images: [],
    youtube_link: '',
    area: '',
    status: 'Available',
    display_order: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await adminApi.getBudgetHomes();
      setHomes(response.data);
    } catch (error) {
      console.error('Error fetching budget homes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const homeData = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0,
        gallery_images: formData.gallery_images.filter(img => img.trim())
      };

      if (editingHome) {
        await adminApi.updateBudgetHome(editingHome._id, homeData);
      } else {
        await adminApi.createBudgetHome(homeData);
      }

      await fetchHomes();
      resetForm();
    } catch (error) {
      console.error('Error saving budget home:', error);
      alert('Error saving budget home. Please try again.');
    }
  };

  const handleDelete = async (homeId) => {
    if (window.confirm('Are you sure you want to delete this budget home?')) {
      try {
        await adminApi.deleteBudgetHome(homeId);
        await fetchHomes();
      } catch (error) {
        console.error('Error deleting budget home:', error);
        alert('Error deleting budget home. Please try again.');
      }
    }
  };

  const handleEdit = (home) => {
    setEditingHome(home);
    setFormData({
      property_name: home.property_name,
      location: home.location,
      price_range: home.price_range,
      property_type: home.property_type,
      built_up_area: home.built_up_area,
      facing: home.facing,
      description: home.description,
      main_image: home.main_image,
      gallery_images: home.gallery_images || [],
      youtube_link: home.youtube_link || '',
      area: home.area || '',
      status: home.status,
      display_order: home.display_order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      property_name: '',
      location: '',
      price_range: '',
      property_type: 'Villa',
      built_up_area: '',
      facing: 'East',
      description: '',
      main_image: '',
      gallery_images: [],
      youtube_link: '',
      area: '',
      status: 'Available',
      display_order: 0
    });
    setEditingHome(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await adminApi.uploadFile(file);
      const imageUrl = response.data.file_url;

      if (field === 'main_image') {
        setFormData(prev => ({ ...prev, main_image: imageUrl }));
      } else if (field === 'gallery') {
        setFormData(prev => ({ 
          ...prev, 
          gallery_images: [...prev.gallery_images, imageUrl] 
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Homes</h1>
          <p className="text-gray-600 mt-1">Manage homes for every budget</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Home'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingHome ? 'Edit Budget Home' : 'Add New Budget Home'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.property_name}
                    onChange={(e) => setFormData({...formData, property_name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price Range *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ₹50L - ₹75L"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.price_range}
                    onChange={(e) => setFormData({...formData, price_range: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Property Type *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.property_type}
                    onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Built-up Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 1600 sq.ft"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.built_up_area}
                    onChange={(e) => setFormData({...formData, built_up_area: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Facing *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.facing}
                    onChange={(e) => setFormData({...formData, facing: e.target.value})}
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="South-East">South-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Area (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., 300 sq.yds"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">YouTube Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.youtube_link}
                    onChange={(e) => setFormData({...formData, youtube_link: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Main Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'main_image')}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={uploading}
                />
                {formData.main_image && (
                  <img 
                    src={getImageUrl(formData.main_image)} 
                    alt="Main" 
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gallery Images</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={uploading}
                />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {formData.gallery_images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={getImageUrl(img)} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingHome ? 'Update' : 'Create')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homes.map((home) => (
          <Card key={home._id}>
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img 
                  src={getImageUrl(home.main_image)} 
                  alt={home.property_name}
                  className="w-full h-48 object-cover rounded"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${
                    home.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {home.status}
                </Badge>
              </div>

              <h3 className="font-bold text-lg mb-2">{home.property_name}</h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{home.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>{home.property_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>{home.facing} Facing</span>
                </div>
                <div className="font-semibold text-emerald-600">
                  {home.price_range}
                </div>
                <div className="text-xs text-gray-500">
                  Built-up: {home.built_up_area}
                </div>
                {home.youtube_link && (
                  <div className="flex items-center gap-2 text-red-600">
                    <Youtube className="w-4 h-4" />
                    <span>Video Tour Available</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(home)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(home._id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {homes.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No budget homes found. Click "Add Home" to create one.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBudgetHomes;
