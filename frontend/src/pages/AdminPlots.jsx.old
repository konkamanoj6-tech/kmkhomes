import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Save,
  X,
  Upload,
  Eye,
  Play,
  Square
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price_range: '',
    area_sqyds: '',
    area_sqft: '',
    short_description: '',
    main_image: '',
    gallery_images: [],
    youtube_link: '',
    status: 'Available',
    featured: false,
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const response = await adminApi.getPlots();
      setPlots(response.data || []);
    } catch (error) {
      console.error('Error fetching plots:', error);
      setPlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        area_sqyds: formData.area_sqyds ? parseFloat(formData.area_sqyds) : null,
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : null
      };

      if (editingPlot) {
        await adminApi.updatePlot(editingPlot._id, submitData);
      } else {
        await adminApi.createPlot(submitData);
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
      title: plot.title,
      location: plot.location,
      price_range: plot.price_range,
      area_sqyds: plot.area_sqyds || '',
      area_sqft: plot.area_sqft || '',
      short_description: plot.short_description,
      main_image: plot.main_image,
      gallery_images: plot.gallery_images || [],
      youtube_link: plot.youtube_link || '',
      status: plot.status,
      featured: plot.featured,
      display_order: plot.display_order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      price_range: '',
      area_sqyds: '',
      area_sqft: '',
      short_description: '',
      main_image: '',
      gallery_images: [],
      youtube_link: '',
      status: 'Available',
      featured: false,
      display_order: 1
    });
    setEditingPlot(null);
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
        main_image: response.data.file_url
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
    return <div className="flex items-center justify-center h-64">Loading plots...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plot Listings</h1>
          <p className="text-gray-600 mt-2">Manage land and plot listings</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Plot
        </Button>
      </div>

      {/* Plot Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingPlot ? 'Edit Plot' : 'Add New Plot'}
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
                    Plot Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Premium Plot in Gachibowli"
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
                  <input
                    type="text"
                    required
                    value={formData.price_range}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., ₹2.5 cr - ₹3.5 cr"
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
                    <option value="Sold">Sold</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (Sq. Yards)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.area_sqyds}
                    onChange={(e) => setFormData(prev => ({ ...prev, area_sqyds: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., 300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (Sq. Feet)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.area_sqft}
                    onChange={(e) => setFormData(prev => ({ ...prev, area_sqft: e.target.value }))}
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

              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image *
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
                  
                  {formData.main_image && (
                    <div className="relative">
                      <img
                        src={formData.main_image}
                        alt="Main image preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
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
                  placeholder="Brief description of the plot..."
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
                  Featured Plot
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
                  {editingPlot ? 'Update Plot' : 'Create Plot'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plots.map((plot) => (
          <Card key={plot._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={plot.main_image}
                alt={plot.title}
                className="w-full h-48 object-cover"
              />
              <Badge className={`absolute top-3 left-3 ${
                plot.status === 'Available' ? 'bg-green-500' :
                plot.status === 'Sold' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {plot.status}
              </Badge>
              
              {plot.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  Featured
                </Badge>
              )}

              {plot.youtube_link && (
                <Button
                  onClick={() => openYouTube(plot.youtube_link)}
                  size="sm"
                  className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Play size={12} className="mr-1" />
                  Tour
                </Button>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-kmk-navy mb-2">{plot.title}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{plot.location}</span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                {plot.area_sqyds && (
                  <div className="flex items-center">
                    <Square size={14} className="mr-2 text-kmk-gold" />
                    <span>{plot.area_sqyds} Sq.Yds</span>
                  </div>
                )}
                {plot.area_sqft && (
                  <div className="flex items-center">
                    <Square size={14} className="mr-2 text-kmk-gold" />
                    <span>{plot.area_sqft} Sq.Ft</span>
                  </div>
                )}
                <div className="font-semibold text-kmk-gold">{plot.price_range}</div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {plot.short_description}
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Order: {plot.display_order}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(plot)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(plot._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </Button>
                {plot.youtube_link && (
                  <Button
                    onClick={() => openYouTube(plot.youtube_link)}
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

      {plots.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Square size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Plots Yet</h3>
            <p className="text-gray-500 mb-6">Add your first plot listing to get started.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Plot
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPlots;