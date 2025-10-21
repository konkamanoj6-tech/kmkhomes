import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, User, Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { publicApi } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    message: '',
    visitDate: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "+91 9791662929",
    email: "homeskmk3@gmail.com",
    whatsapp: "919791662929",
    address: "Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.35148728277!2d78.24323262812499!3d17.412608040492422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1645678901234!5m2!1sen!2sin"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await publicApi.getContactInfo();
      if (response.data) {
        setContactInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await publicApi.submitContactForm(formData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      
      // Send WhatsApp notification
      const whatsappMessage = `New Contact Form Submission:%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AProperty Interest: ${formData.propertyInterest || 'Not specified'}%0AVisit Date: ${formData.visitDate || 'Not specified'}%0AMessage: ${formData.message}`;
      const whatsappUrl = `https://wa.me/919791662929?text=${whatsappMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyInterest: '',
        message: '',
        visitDate: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfoItems = [
    {
      icon: Phone,
      title: "Phone",
      details: contactInfo.phone,
      action: `tel:${contactInfo.phone}`,
      actionText: "Call Now"
    },
    {
      icon: Mail,
      title: "Email",
      details: contactInfo.email,
      action: `mailto:${contactInfo.email}`,
      actionText: "Send Email"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: contactInfo.address,
      action: "https://maps.google.com/?q=" + encodeURIComponent(contactInfo.address),
      actionText: "Get Directions"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: contactInfo.business_hours || "Mon - Sat: 9:00 AM - 7:00 PM\nSun: 10:00 AM - 5:00 PM",
      action: null,
      actionText: null
    }
  ];

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Header */}
      <section className="bg-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to find your dream home? Get in touch with our expert team for personalized assistance 
            and schedule your site visit today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl text-kmk-navy mb-2">Get in Touch</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-semibold">✅ Thank you! We've received your enquiry and will contact you soon.</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                          placeholder="+91 9791662929"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="propertyInterest" className="block text-sm font-semibold text-gray-700 mb-2">
                        Property Interest
                      </label>
                      <div className="relative">
                        <HomeIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          id="propertyInterest"
                          name="propertyInterest"
                          value={formData.propertyInterest}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent appearance-none"
                        >
                          <option value="">Select Property Type</option>
                          <option value="luxury-villa">Luxury Villa</option>
                          <option value="duplex-villa">Duplex Villa</option>
                          <option value="triplex-villa">Triplex Villa</option>
                          <option value="custom-project">Custom Project</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="visitDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Visit Date
                      </label>
                      <input
                        type="date"
                        id="visitDate"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent resize-none"
                      placeholder="Tell us about your requirements, budget, or any specific questions..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={submitting}
                    size="lg" 
                    className="w-full bg-kmk-gold hover:bg-kmk-gold/90 text-white py-4"
                  >
                    <Send size={18} className="mr-2" />
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfoItems.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-kmk-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent size={24} className="text-kmk-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-kmk-navy mb-2">{info.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">{info.details}</p>
                          {info.action && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white"
                            >
                              <a
                                href={info.action}
                                target={info.title === "Office Address" ? "_blank" : undefined}
                                rel={info.title === "Office Address" ? "noopener noreferrer" : undefined}
                              >
                                {info.actionText}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Quick WhatsApp */}
              <Card className="border-0 shadow-lg bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <MessageCircle size={32} className="mx-auto text-green-600 mb-3" />
                  <h3 className="font-bold text-green-800 mb-2">Quick WhatsApp</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Get instant responses to your queries
                  </p>
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp}?text=Hi! I'm interested in KMK Homes villas. Can you provide more information?`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-kmk-navy text-white">
              <CardTitle className="text-2xl">Visit Our Office</CardTitle>
              <p className="text-gray-300">
                Find us at our Hyderabad office for in-person consultations
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-gray-100">
                <iframe
                  src={contactInfo.mapEmbedUrl || contactInfo.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KMK Homes Office Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;