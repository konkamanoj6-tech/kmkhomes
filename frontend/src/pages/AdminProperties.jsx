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
  HomeIcon as Home,
  Compass,
  Image as ImageIcon,
  Star,
  Eye
} from 'lucide-react';
import { adminApi } from '../services/api';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    villa_number: '',
    status: 'Available',
    plot_size: '',
    built_up_area: '',
    facing: 'East',
    location: '',
    price_range: '',
    gallery_images: [],
    description: '',
    amenities: [],
    enquiry_link: '',
    map_link: '',
    youtube_link: '',
    nearby_places: [],
    featured: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await adminApi.getProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        plot_size: parseInt(formData.plot_size),
        built_up_area: parseInt(formData.built_up_area),
        amenities: formData.amenities.filter(a => a.trim())
      };

      if (editingProperty) {
        await adminApi.updateProperty(editingProperty._id, propertyData);
      } else {
        await adminApi.createProperty(propertyData);
      }

      await fetchProperties();
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await adminApi.deleteProperty(propertyId);
        await fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property. Please try again.');
      }
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      villa_number: property.villa_number,
      status: property.status,
      plot_size: property.plot_size.toString(),
      built_up_area: property.built_up_area.toString(),
      facing: property.facing,
      location: property.location,
      price_range: property.price_range,
      gallery_images: property.gallery_images || [],
      description: property.description,
      amenities: property.amenities || [],
      enquiry_link: property.enquiry_link,
      map_link: property.map_link,
      youtube_link: property.youtube_link || '',
      nearby_places: property.nearby_places || [],
      featured: property.featured
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      villa_number: '',
      status: 'Available',
      plot_size: '',
      built_up_area: '',
      facing: 'East',
      location: '',
      price_range: '',
      gallery_images: [],
      description: '',
      amenities: [],
      enquiry_link: '',
      map_link: '',
      youtube_link: '',
      nearby_places: [],
      featured: false
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(file => adminApi.uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      const imageUrls = responses.map(response => response.data.file_url);
      
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...imageUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData(prev => ({ ...prev, amenities: newAmenities }));
  };

  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }));
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage your property listings</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-kmk-navy hover:bg-kmk-navy/90"
        >
          <Plus size={16} className="mr-2" />
          Add Property
        </Button>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Villa Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.villa_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, villa_number: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., KMK-001"
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
                    Plot Size (Sq. Yds) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.plot_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, plot_size: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., 2400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Built-up Area (Sq. Ft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.built_up_area}
                    onChange={(e) => setFormData(prev => ({ ...prev, built_up_area: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., 3200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facing *
                  </label>
                  <select
                    required
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
                    Price Range *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price_range}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., ₹2.5 - 3.2 Cr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="e.g., Jubilee Hills, Hyderabad"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!formData.location) {
                        alert('Please enter a location first');
                        return;
                      }
                      try {
                        setUploading(true);
                        const response = await adminApi.fetchNearbyPlaces(formData.location);
                        setFormData(prev => ({ ...prev, nearby_places: response.data.nearby_places }));
                        alert(`Found ${response.data.nearby_places.length} nearby places!`);
                      } catch (error) {
                        console.error('Error fetching nearby places:', error);
                        alert('Error fetching nearby places. Please try again.');
                      } finally {
                        setUploading(false);
                      }
                    }}
                    disabled={uploading}
                  >
                    {uploading ? 'Fetching...' : '🗺️ Fetch Nearby Places'}
                  </Button>
                </div>
                {formData.nearby_places && formData.nearby_places.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm font-medium text-gray-700 mb-2">Found {formData.nearby_places.length} nearby places:</p>
                    <div className="space-y-1 text-xs">
                      {formData.nearby_places.slice(0, 10).map((place, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{place.type}: {place.name}</span>
                          <span className="text-gray-500">{place.distance} km</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  placeholder="Describe the property features and benefits..."
                />
              </div>

              {/* Main/Thumbnail Image */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 text-kmk-navy">Main/Thumbnail Image</h3>
                <p className="text-sm text-gray-600 mb-3">Add the main image that will be used as thumbnail in listings</p>
                
                {/* Image URL Input */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">
                    Image URL (Recommended: Use Cloudinary, Imgur, Unsplash, etc.)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const url = e.target.value.trim();
                          if (url) {
                            // Add as first image in gallery if gallery is empty
                            if (formData.gallery_images.length === 0) {
                              setFormData(prev => ({
                                ...prev,
                                gallery_images: [url, ...prev.gallery_images]
                              }));
                            } else {
                              // Replace first image
                              const newGallery = [...formData.gallery_images];
                              newGallery[0] = url;
                              setFormData(prev => ({
                                ...prev,
                                gallery_images: newGallery
                              }));
                            }
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        const url = input.value.trim();
                        if (url) {
                          // Add as first image in gallery if gallery is empty
                          if (formData.gallery_images.length === 0) {
                            setFormData(prev => ({
                              ...prev,
                              gallery_images: [url, ...prev.gallery_images]
                            }));
                          } else {
                            // Replace first image
                            const newGallery = [...formData.gallery_images];
                            newGallery[0] = url;
                            setFormData(prev => ({
                              ...prev,
                              gallery_images: newGallery
                            }));
                          }
                          input.value = '';
                        }
                      }}
                      variant="outline"
                    >
                      Set as Main
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Press Enter or click "Set as Main" - This will be the first image in your gallery</p>
                </div>

                {/* Preview */}
                {formData.gallery_images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Current Main/Thumbnail:</p>
                    <img 
                      src={formData.gallery_images[0]} 
                      alt="Main preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Gallery Images
                </label>
                <div className="space-y-4">
                  {/* File Upload Option */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Option 1: Upload from Computer</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  
                  {/* Image URL Option */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Option 2: Paste Image URL (Cloudinary, Imgur, etc.)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.target.value.trim();
                            if (url) {
                              setFormData(prev => ({
                                ...prev,
                                gallery_images: [...prev.gallery_images, url]
                              }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const url = input.value.trim();
                          if (url) {
                            setFormData(prev => ({
                              ...prev,
                              gallery_images: [...prev.gallery_images, url]
                            }));
                            input.value = '';
                          }
                        }}
                        variant="outline"
                      >
                        Add URL
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Press Enter or click "Add URL" to add</p>
                  </div>
                  
                  {uploading && <p className="text-sm text-gray-600">Uploading images...</p>}
                  
                  {formData.gallery_images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.gallery_images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImage(index)}
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 w-6 h-6 p-0"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                        placeholder="e.g., Swimming Pool"
                      />
                      <Button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addAmenity}
                    variant="outline"
                    size="sm"
                  >
                    <Plus size={14} className="mr-2" />
                    Add Amenity
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Enquiry Link
                  </label>
                  <input
                    type="url"
                    value={formData.enquiry_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, enquiry_link: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                    placeholder="https://wa.me/919876543210"
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
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video Link (Optional)
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-kmk-gold focus:ring-kmk-gold"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Property (Show on homepage)
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
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              {property.gallery_images && property.gallery_images.length > 0 ? (
                <img
                  src={property.gallery_images[0]}
                  alt={property.villa_number}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              
              <Badge className={`absolute top-3 left-3 ${
                property.status === 'Available' 
                  ? 'bg-green-500' 
                  : property.status === 'Sold Out'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}>
                {property.status}
              </Badge>

              {property.featured && (
                <Badge className="absolute top-3 right-3 bg-kmk-gold">
                  <Star size={12} className="mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{property.villa_number}</h3>
                <span className="text-lg font-bold text-kmk-gold">{property.price_range}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={16} className="mr-2 text-kmk-gold" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <Ruler size={16} className="mr-2 text-kmk-gold" />
                  <span>{property.plot_size} Sq.Yds</span>
                </div>
                <div className="flex items-center">
                  <Home size={16} className="mr-2 text-kmk-gold" />
                  <span>{property.built_up_area} Sq.Ft</span>
                </div>
                <div className="flex items-center">
                  <Compass size={16} className="mr-2 text-kmk-gold" />
                  <span>{property.facing} Facing</span>
                </div>
                <div className="flex items-center">
                  <ImageIcon size={16} className="mr-2 text-kmk-gold" />
                  <span>{property.gallery_images?.length || 0} Images</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                {property.description}
              </p>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(property)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(property._id)}
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
                  <a href={`/property/${property._id}`} target="_blank" rel="noopener noreferrer">
                    <Eye size={14} />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first property listing.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-kmk-navy hover:bg-kmk-navy/90"
            >
              <Plus size={16} className="mr-2" />
              Add First Property
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminProperties;