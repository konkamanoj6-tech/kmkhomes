import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Zap,
  Save,
  X,
  Upload,
  Eye
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon_url: '',
    category: 'general',
    featured: false,
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await adminApi.getAmenities();
      setAmenities(response.data || []);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAmenity) {
        await adminApi.updateAmenity(editingAmenity._id, formData);
      } else {
        await adminApi.createAmenity(formData);
      }

      await fetchAmenities();
      resetForm();
    } catch (error) {
      console.error('Error saving amenity:', error);
      alert('Error saving amenity. Please try again.');
    }
  };

  const handleDelete = async (amenityId) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      try {
        await adminApi.deleteAmenity(amenityId);
        await fetchAmenities();
      } catch (error) {
        console.error('Error deleting amenity:', error);
        alert('Error deleting amenity. Please try again.');
      }
    }
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description || '',
      icon_url: amenity.icon_url || '',
      category: amenity.category || 'general',
      featured: amenity.featured || false,
      display_order: amenity.display_order || 1
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon_url: '',
      category: 'general',
      featured: false,
      display_order: 1
    });
    setEditingAmenity(null);
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
        icon_url: response.data.file_url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading amenities...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amenities</h1>
          <p className="text-gray-600 mt-2">Manage property amenities and features</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Amenity
        </Button>
      </div>

      {/* Amenity Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
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
                    Amenity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Swimming Pool, Gymnasium, Kids Play Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  >
                    <option value="general">General</option>
                    <option value="security">Security</option>
                    <option value="recreation">Recreation</option>
                    <option value="wellness">Wellness</option>
                    <option value="convenience">Convenience</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="green">Green Features</option>
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
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenity Icon (Recommended: 64x64px)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  {uploading && <p className="text-sm text-gray-600">Uploading icon...</p>}
                  
                  {formData.icon_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.icon_url}
                        alt="Amenity icon preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon_url: '' }))}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Brief description of the amenity..."
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
                  Featured Amenity (Show prominently)
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
                  {editingAmenity ? 'Update Amenity' : 'Create Amenity'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Amenities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {amenities.map((amenity) => (
          <Card key={amenity._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {amenity.icon_url ? (
                    <img
                      src={amenity.icon_url}
                      alt={amenity.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-kmk-navy rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{amenity.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {amenity.category}
                    </Badge>
                  </div>
                </div>
                {amenity.featured && (
                  <Badge className="bg-kmk-gold text-xs">Featured</Badge>
                )}
              </div>

              {amenity.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {amenity.description}
                </p>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Display Order: {amenity.display_order}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(amenity)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(amenity._id)}
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

      {amenities.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Zap size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Amenities Yet</h3>
            <p className="text-gray-500 mb-6">Add your first amenity to showcase property features.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Amenity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAmenities;