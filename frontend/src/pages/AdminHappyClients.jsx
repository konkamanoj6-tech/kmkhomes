import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Star,
  Save,
  X,
  Upload,
  Users
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminHappyClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    story: '',
    image_url: '',
    rating: 5,
    featured: false,
    display_order: 1,
    purchase_date: '',
    villa_number: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await adminApi.getHappyClients();
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching happy clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        await adminApi.updateHappyClient(editingClient._id, formData);
      } else {
        await adminApi.createHappyClient(formData);
      }

      await fetchClients();
      resetForm();
    } catch (error) {
      console.error('Error saving happy client:', error);
      alert('Error saving happy client. Please try again.');
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this happy client story?')) {
      try {
        await adminApi.deleteHappyClient(clientId);
        await fetchClients();
      } catch (error) {
        console.error('Error deleting happy client:', error);
        alert('Error deleting happy client. Please try again.');
      }
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      location: client.location,
      story: client.story,
      image_url: client.image_url,
      rating: client.rating,
      featured: client.featured,
      display_order: client.display_order,
      purchase_date: client.purchase_date || '',
      villa_number: client.villa_number || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      story: '',
      image_url: '',
      rating: 5,
      featured: false,
      display_order: 1,
      purchase_date: '',
      villa_number: ''
    });
    setEditingClient(null);
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
    return <div className="flex items-center justify-center h-64">Loading happy clients...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Happy Clients</h1>
          <p className="text-gray-600 mt-2">Manage customer success stories and reviews</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Happy Client
        </Button>
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingClient ? 'Edit Happy Client' : 'Add New Happy Client'}
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
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Mr. Rajesh Sharma"
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
                    placeholder="e.g., Jubilee Hills Villa Owner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Villa Number
                  </label>
                  <input
                    type="text"
                    value={formData.villa_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, villa_number: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Villa No 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <select
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
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

              {/* Client Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Photo (Recommended: 300x300px)
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
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Client photo preview"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
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

              {/* Success Story */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Story *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.story}
                  onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Write the client's success story or experience with KMK Homes..."
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
                  Featured Client (Show on homepage)
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
                  {editingClient ? 'Update Client' : 'Create Client'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {client.image_url ? (
                    <img
                      src={client.image_url}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.location}</p>
                    {client.villa_number && (
                      <p className="text-xs text-kmk-gold font-medium">{client.villa_number}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex text-kmk-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < client.rating ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                  {client.featured && (
                    <Badge className="bg-kmk-gold text-xs">Featured</Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-700 italic mb-6 line-clamp-4">
                "{client.story}"
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Display Order: {client.display_order}
                {client.purchase_date && (
                  <span className="ml-4">Purchase: {new Date(client.purchase_date).toLocaleDateString()}</span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(client)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(client._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Happy Clients Yet</h3>
            <p className="text-gray-500 mb-6">Add your first client success story to build trust.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminHappyClients;