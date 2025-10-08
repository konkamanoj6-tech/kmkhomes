import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Mail, Phone, User, MessageSquare, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { adminApi } from '../services/api';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await adminApi.getContactSubmissions();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading contact submissions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Form Submissions</h1>
          <p className="text-gray-600 mt-2">
            View and manage customer inquiries from your website ({submissions.length} total)
          </p>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Submissions Yet</h3>
            <p className="text-gray-500">Customer inquiries will appear here when they contact you through the website.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <Card key={submission._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-kmk-gold" />
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(submission.status)} text-white`}>
                    {submission.status || 'new'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone size={14} className="mr-2 text-kmk-gold flex-shrink-0" />
                    <span className="text-gray-700">{submission.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail size={14} className="mr-2 text-kmk-gold flex-shrink-0" />
                    <span className="text-gray-700 truncate">{submission.email}</span>
                  </div>
                  {submission.property_interest && (
                    <div className="flex items-center text-sm">
                      <MessageSquare size={14} className="mr-2 text-kmk-gold flex-shrink-0" />
                      <span className="text-gray-700">Interested in: {submission.property_interest}</span>
                    </div>
                  )}
                  {submission.visit_date && (
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-2 text-kmk-gold flex-shrink-0" />
                      <span className="text-gray-700">Visit: {submission.visit_date}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg line-clamp-3">
                    {submission.message}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 border-t pt-3">
                  Submitted: {formatDate(submission.created_at)}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    asChild
                    size="sm" 
                    className="flex-1 bg-kmk-navy hover:bg-kmk-navy/90"
                  >
                    <a href={`tel:${submission.phone}`}>
                      <Phone size={14} className="mr-1" />
                      Call
                    </a>
                  </Button>
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    <a href={`mailto:${submission.email}`}>
                      <Mail size={14} className="mr-1" />
                      Email
                    </a>
                  </Button>
                  <Button 
                    asChild
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <a 
                      href={`https://wa.me/${submission.phone.replace(/\D/g, '')}?text=Hi ${submission.name}, thank you for your inquiry about KMK Homes properties. I'd be happy to help you!`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-kmk-navy to-kmk-navy/90 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">📊 Submission Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-kmk-gold">{submissions.length}</div>
                <div className="text-sm text-gray-300">Total Inquiries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kmk-gold">
                  {submissions.filter(s => s.status === 'new' || !s.status).length}
                </div>
                <div className="text-sm text-gray-300">New</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kmk-gold">
                  {submissions.filter(s => s.property_interest).length}
                </div>
                <div className="text-sm text-gray-300">Property Interest</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kmk-gold">
                  {submissions.filter(s => s.visit_date).length}
                </div>
                <div className="text-sm text-gray-300">Site Visits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSubmissions;