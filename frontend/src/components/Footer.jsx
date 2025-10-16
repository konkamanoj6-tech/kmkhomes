import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { publicApi } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = React.useState({
    phone: "+91 8074831140",
    email: "homeskmk3@gmail.com",
    whatsapp: "918074831140",
    address: "Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033"
  });

  React.useEffect(() => {
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

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'NRI Corner', path: '/nri-corner' }
  ];

  const services = [
    { name: 'Villa Construction', path: '/projects' },
    { name: 'Property Investment', path: '/projects' },
    { name: 'NRI Services', path: '/nri-corner' },
    { name: 'Site Visits', path: '/contact' }
  ];

  return (
    <footer className="bg-kmk-navy text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-kmk-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-kmk-navy font-bold text-xl">KMK</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">KMK Homes</h3>
                <p className="text-gray-300 text-sm">Premium Villas & Luxury Living</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building dream homes with exceptional quality, innovative design, and world-class amenities. 
              Your trusted partner in luxury real estate.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-kmk-gold/20 hover:bg-kmk-gold rounded-lg flex items-center justify-center transition-colors duration-200">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-kmk-gold/20 hover:bg-kmk-gold rounded-lg flex items-center justify-center transition-colors duration-200">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-kmk-gold/20 hover:bg-kmk-gold rounded-lg flex items-center justify-center transition-colors duration-200">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-kmk-gold">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-kmk-gold transition-colors duration-200 flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-kmk-gold">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-kmk-gold transition-colors duration-200 flex items-center"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-kmk-gold">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-kmk-gold mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  {contactInfo.address}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-kmk-gold flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-kmk-gold transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-kmk-gold flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-kmk-gold transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle size={18} className="text-kmk-gold flex-shrink-0" />
                <a 
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kmk-gold transition-colors"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} KMK Homes. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-kmk-gold text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-kmk-gold text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-kmk-gold text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href={`https://wa.me/${contactInfo.whatsapp}?text=Hi! I'm interested in KMK Homes villas. Can you provide more information?`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse"
      >
        <MessageCircle size={24} />
      </a>
    </footer>
  );
};

export default Footer;