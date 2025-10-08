import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Phone, Mail, MapPin, MessageCircle, Save, Clock } from 'lucide-react';
import { adminApi } from '../services/api';

const AdminContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    company_name: 'KMK Homes',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    map_embed_url: '',
    business_hours: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await adminApi.getContactInfo();
      if (response.data) {
        setContactInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await adminApi.updateContactInfo(contactInfo);
      setMessage('Contact information updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating contact info:', error);
      setMessage('Error updating contact information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading contact information...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-600 mt-2">Manage your company contact details and business information</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Contact Info Form */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone size={24} className="mr-3 text-kmk-gold" />
            Company Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={contactInfo.company_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                  placeholder="KMK Homes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={contactInfo.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={contactInfo.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                  placeholder="info@kmkhomes.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle size={16} className="inline mr-2" />
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={contactInfo.whatsapp || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                  placeholder="919876543210 (without +)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Office Address *
              </label>
              <textarea
                name="address"
                required
                rows="3"
                value={contactInfo.address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                placeholder="Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Business Hours
              </label>
              <textarea
                name="business_hours"
                rows="2"
                value={contactInfo.business_hours || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                placeholder="Mon - Sat: 9:00 AM - 7:00 PM&#10;Sun: 10:00 AM - 5:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL
              </label>
              <input
                type="url"
                name="map_embed_url"
                value={contactInfo.map_embed_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Get embed URL from Google Maps → Share → Embed a map
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={fetchContactInfo}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-kmk-navy hover:bg-kmk-navy/90"
              >
                <Save size={16} className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-0 shadow-lg bg-gray-50">
        <CardHeader>
          <CardTitle>Contact Information Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <Phone size={20} className="text-kmk-gold mb-2" />
              <p className="font-semibold">Phone</p>
              <p className="text-sm text-gray-600">{contactInfo.phone || 'Not set'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Mail size={20} className="text-kmk-gold mb-2" />
              <p className="font-semibold">Email</p>
              <p className="text-sm text-gray-600">{contactInfo.email || 'Not set'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <MessageCircle size={20} className="text-kmk-gold mb-2" />
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm text-gray-600">{contactInfo.whatsapp || 'Not set'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <MapPin size={20} className="text-kmk-gold mb-2" />
              <p className="font-semibold">Address</p>
              <p className="text-sm text-gray-600">{contactInfo.address ? contactInfo.address.substring(0, 50) + '...' : 'Not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-kmk-navy to-kmk-navy/90 text-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4">💡 Contact Info Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>WhatsApp Number:</strong> Use country code without + symbol (e.g., 919876543210)</p>
            </div>
            <div>
              <p><strong>Google Maps:</strong> Embed URL makes the map interactive on your contact page</p>
            </div>
            <div>
              <p><strong>Business Hours:</strong> Use line breaks to separate days for better formatting</p>
            </div>
            <div>
              <p><strong>Changes:</strong> Updates appear immediately on your website</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactInfo;