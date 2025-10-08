import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Eye,
  Save,
  X,
  Upload
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    display_order: 1
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await adminApi.getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBanner) {
        await adminApi.updateBanner(editingBanner._id, formData);
      } else {
        await adminApi.createBanner(formData);
      }

      await fetchBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner. Please try again.');
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await adminApi.deleteBanner(bannerId);
        await fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner. Please try again.');
      }
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      cta_text: banner.cta_text || '',
      cta_link: banner.cta_link || '',
      display_order: banner.display_order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      cta_text: '',
      cta_link: '',
      display_order: 1
    });
    setEditingBanner(null);
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
        image_url: response.data.file_url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading banners...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Banners</h1>
          <p className="text-gray-600 mt-2">Manage hero section banners and sliders</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
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
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Find Your Dream Home"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., with KMK Homes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., View All Projects"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., /projects"
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image * (Recommended: 1920x800px)
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
                  
                  {formData.image_url && (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
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
                  disabled={!formData.image_url}
                >
                  <Save size={16} className="mr-2" />
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              {banner.image_url ? (
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              
              <Badge className="absolute top-3 left-3 bg-kmk-navy">
                Order: {banner.display_order}
              </Badge>

              {banner.active && (
                <Badge className="absolute top-3 right-3 bg-green-500">
                  Active
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{banner.title}</h3>
              
              {banner.subtitle && (
                <p className="text-gray-600 mb-4">{banner.subtitle}</p>
              )}

              {banner.cta_text && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>CTA:</strong> {banner.cta_text}
                  </p>
                  {banner.cta_link && (
                    <p className="text-xs text-gray-500 mt-1">
                      Link: {banner.cta_link}
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(banner)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(banner._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <Eye size={14} />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Banners Yet</h3>
            <p className="text-gray-500 mb-6">Create your first hero banner for the homepage.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Banner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBanners;