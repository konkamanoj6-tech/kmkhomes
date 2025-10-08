import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  FileText,
  Save,
  X,
  Upload,
  Eye,
  MapPin
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminNRICorner = () => {
  const [nriContent, setNriContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    section_name: '',
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: 'guide',
    featured: false,
    display_order: 1,
    tags: '',
    country: '',
    useful_links: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNRIContent();
  }, []);

  const fetchNRIContent = async () => {
    try {
      const response = await adminApi.getNRIContent();
      setNriContent(response.data || []);
    } catch (error) {
      console.error('Error fetching NRI content:', error);
      setNriContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        useful_links: formData.useful_links ? formData.useful_links.split(',').map(link => link.trim()) : []
      };

      if (editingContent) {
        await adminApi.updateNRIContent(editingContent._id, submitData);
      } else {
        await adminApi.createNRIContent(submitData);
      }

      await fetchNRIContent();
      resetForm();
    } catch (error) {
      console.error('Error saving NRI content:', error);
      alert('Error saving NRI content. Please try again.');
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this NRI content?')) {
      try {
        await adminApi.deleteNRIContent(contentId);
        await fetchNRIContent();
      } catch (error) {
        console.error('Error deleting NRI content:', error);
        alert('Error deleting NRI content. Please try again.');
      }
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      section_name: content.section_name,
      title: content.title,
      content: content.content,
      excerpt: content.excerpt || '',
      image_url: content.image_url || '',
      category: content.category,
      featured: content.featured,
      display_order: content.display_order,
      tags: content.tags ? content.tags.join(', ') : '',
      country: content.country || '',
      useful_links: content.useful_links ? content.useful_links.join(', ') : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      section_name: '',
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      category: 'guide',
      featured: false,
      display_order: 1,
      tags: '',
      country: '',
      useful_links: ''
    });
    setEditingContent(null);
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
    return <div className="flex items-center justify-center h-64">Loading NRI content...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NRI Corner</h1>
          <p className="text-gray-600 mt-2">Manage content for Non-Resident Indian customers</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add NRI Content
        </Button>
      </div>

      {/* Content Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingContent ? 'Edit NRI Content' : 'Add New NRI Content'}
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
                    Section Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.section_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, section_name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Investment Guide, Legal Process, FAQs"
                  />
                </div>

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
                    placeholder="e.g., Complete Guide to Property Investment from USA"
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
                    <option value="guide">Investment Guide</option>
                    <option value="legal">Legal Information</option>
                    <option value="process">Process & Procedures</option>
                    <option value="faq">FAQs</option>
                    <option value="success-story">Success Stories</option>
                    <option value="documentation">Documentation</option>
                    <option value="taxation">Taxation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country/Region
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., USA, UK, Canada, UAE, Singapore"
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
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., NRI, investment, property, legal, process"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image (Optional)
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
                        alt="Featured image preview"
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

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Brief Summary)
                </label>
                <textarea
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Brief summary for listings..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows="8"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Detailed content for NRI customers..."
                />
              </div>

              {/* Useful Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Useful Links (comma-separated URLs)
                </label>
                <textarea
                  rows="2"
                  value={formData.useful_links}
                  onChange={(e) => setFormData(prev => ({ ...prev, useful_links: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="https://example.com/guide1, https://example.com/guide2"
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
                  Featured Content (Show prominently)
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
                  {editingContent ? 'Update Content' : 'Create Content'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nriContent.map((content) => (
          <Card key={content._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              {content.image_url ? (
                <img
                  src={content.image_url}
                  alt={content.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-kmk-navy rounded-t-lg flex items-center justify-center">
                  <Globe size={48} className="text-white" />
                </div>
              )}
              
              <Badge className={`absolute top-3 left-3 ${
                content.category === 'guide' ? 'bg-blue-500' :
                content.category === 'legal' ? 'bg-red-500' :
                content.category === 'process' ? 'bg-green-500' :
                content.category === 'faq' ? 'bg-purple-500' :
                content.category === 'success-story' ? 'bg-orange-500' :
                content.category === 'documentation' ? 'bg-gray-600' :
                'bg-yellow-500'
              }`}>
                {content.category}
              </Badge>

              {content.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {content.section_name}
                </Badge>
                {content.country && (
                  <Badge variant="outline" className="text-xs ml-2">
                    <MapPin size={10} className="mr-1" />
                    {content.country}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
              
              {content.excerpt && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {content.excerpt}
                </p>
              )}

              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {content.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Order: {content.display_order}
                {content.useful_links && content.useful_links.length > 0 && (
                  <span className="ml-4">{content.useful_links.length} links</span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(content)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(content._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Eye size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {nriContent.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Globe size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No NRI Content Yet</h3>
            <p className="text-gray-500 mb-6">Add content to help Non-Resident Indian customers with their property investment journey.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminNRICorner;