import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building2, Users, MessageSquare, TrendingUp, Eye, Edit, Mail } from 'lucide-react';
import { adminApi, publicApi } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    availableProperties: 0,
    testimonials: 0,
    contactSubmissions: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        propertiesRes,
        testimonialsRes,
        submissionsRes
      ] = await Promise.all([
        publicApi.getProperties(),
        adminApi.getTestimonials(),
        adminApi.getContactSubmissions()
      ]);

      const properties = propertiesRes.data;
      const availableProperties = properties.filter(p => p.status === 'Available');
      
      setStats({
        properties: properties.length,
        availableProperties: availableProperties.length,
        testimonials: testimonialsRes.data.length,
        contactSubmissions: submissionsRes.data.length
      });

      // Get recent submissions (last 5)
      setRecentSubmissions(submissionsRes.data.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Properties',
      value: stats.properties,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/admin/properties'
    },
    {
      title: 'Available Properties',
      value: stats.availableProperties,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/properties'
    },
    {
      title: 'Client Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'bg-purple-500',
      link: '/admin/testimonials'
    },
    {
      title: 'Contact Inquiries',
      value: stats.contactSubmissions,
      icon: Mail,
      color: 'bg-orange-500',
      link: '/admin/submissions'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to KMK Homes CMS. Manage your content and track your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={card.link}>
                      <Eye size={14} className="mr-2" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contact Submissions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Contact Inquiries
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/submissions">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{submission.name}</h4>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{submission.phone}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{submission.email}</p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{submission.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatDate(submission.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent contact submissions</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button asChild className="bg-kmk-navy hover:bg-kmk-navy/90 justify-start">
                <Link to="/admin/properties">
                  <Building2 size={16} className="mr-2" />
                  Add New Property
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white">
                <Link to="/admin/banners">
                  <Edit size={16} className="mr-2" />
                  Update Home Banners
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/testimonials">
                  <MessageSquare size={16} className="mr-2" />
                  Add Testimonial
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/contact">
                  <Edit size={16} className="mr-2" />
                  Update Contact Info
                </Link>
              </Button>

              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/" target="_blank">
                    <Eye size={16} className="mr-2" />
                    Preview Website
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips and Help */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-kmk-navy to-kmk-navy/90 text-white">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold mb-4">💡 CMS Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Property Management</h4>
              <p className="text-sm text-gray-200">
                Use the "Featured" toggle to show properties on the homepage. Update status to "Available" or "Sold Out" as needed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Home Banners</h4>
              <p className="text-sm text-gray-200">
                Upload high-quality images (1920x800px recommended) for hero banners. Use display order to arrange the sequence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">SEO Optimization</h4>
              <p className="text-sm text-gray-200">
                Write descriptive titles and content for better search engine visibility. Keep descriptions concise and informative.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Image Upload</h4>
              <p className="text-sm text-gray-200">
                Upload images in JPG or PNG format. The system will handle optimization and generate appropriate URLs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;