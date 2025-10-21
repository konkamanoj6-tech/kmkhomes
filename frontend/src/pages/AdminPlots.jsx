import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Ruler,
  Image as ImageIcon,
  Youtube
} from 'lucide-react';
import { adminApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [formData, setFormData] = useState({
    plot_name: '',
    location: '',
    plot_area: '',
    price_range: '',
    property_type: 'Residential',
    description: '',
    main_image: '',
    gallery_images: [],
    youtube_link: '',
    status: 'Available',
    display_order: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const response = await adminApi.getPlots();
      setPlots(response.data);
    } catch (error) {
      console.error('Error fetching plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const plotData = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0,
        gallery_images: formData.gallery_images.filter(img => img.trim())
      };

      if (editingPlot) {
        await adminApi.updatePlot(editingPlot._id, plotData);
      } else {
        await adminApi.createPlot(plotData);
      }

      await fetchPlots();
      resetForm();
    } catch (error) {
      console.error('Error saving plot:', error);
      alert('Error saving plot. Please try again.');
    }
  };

  const handleDelete = async (plotId) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      try {
        await adminApi.deletePlot(plotId);
        await fetchPlots();
      } catch (error) {
        console.error('Error deleting plot:', error);
        alert('Error deleting plot. Please try again.');
      }
    }
  };

  const handleEdit = (plot) => {
    setEditingPlot(plot);
    setFormData({
      plot_name: plot.plot_name,
      location: plot.location,
      plot_area: plot.plot_area,
      price_range: plot.price_range,
      property_type: plot.property_type,
      description: plot.description,
      main_image: plot.main_image,
      gallery_images: plot.gallery_images || [],
      youtube_link: plot.youtube_link || '',
      status: plot.status,
      display_order: plot.display_order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      plot_name: '',
      location: '',
      plot_area: '',
      price_range: '',
      property_type: 'Residential',
      description: '',
      main_image: '',
      gallery_images: [],
      youtube_link: '',
      status: 'Available',
      display_order: 0
    });
    setEditingPlot(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Plots</h1>
          <p className="text-gray-600 mt-1">Manage open plots</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Plot'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingPlot ? 'Edit Plot' : 'Add New Plot'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plot Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.plot_name}
                    onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
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
                  <label className="block text-sm font-medium mb-1">Plot Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 300 sq.yds or 2400 sq.ft"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.plot_area}
                    onChange={(e) => setFormData({...formData, plot_area: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price Range *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ₹45L - ₹60L"
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
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
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

              {/* Main Image Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 text-kmk-navy">Main/Thumbnail Image</h3>
                
                {/* Image URL Option (Primary) */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">
                    Image URL * (Recommended: Use Cloudinary, Imgur, Unsplash, etc.)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-kmk-gold"
                      value={formData.main_image}
                      onChange={(e) => setFormData({...formData, main_image: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Paste the direct image URL from Unsplash, Cloudinary, Imgur, or any image hosting service</p>
                </div>

                {/* File Upload Option (Alternative) */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-500 mb-1">
                    OR Upload from Computer (Alternative)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'main_image')}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    disabled={uploading}
                  />
                </div>

                {/* Image Preview */}
                {formData.main_image && (
                  <div className="mt-3">
                    <img 
                      src={getImageUrl(formData.main_image)} 
                      alt="Main preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                  </div>
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
                  {uploading ? 'Uploading...' : (editingPlot ? 'Update' : 'Create')}
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
        {plots.map((plot) => (
          <Card key={plot._id}>
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img 
                  src={getImageUrl(plot.main_image)} 
                  alt={plot.plot_name}
                  className="w-full h-48 object-cover rounded"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${
                    plot.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {plot.status}
                </Badge>
              </div>

              <h3 className="font-bold text-lg mb-2">{plot.plot_name}</h3>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{plot.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  <span>{plot.plot_area}</span>
                </div>
                <div className="font-semibold text-emerald-600">
                  {plot.price_range}
                </div>
                <div className="text-xs text-gray-500">
                  Type: {plot.property_type}
                </div>
                {plot.youtube_link && (
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
                  onClick={() => handleEdit(plot)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(plot._id)}
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

      {plots.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No plots found. Click "Add Plot" to create one.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPlots;
