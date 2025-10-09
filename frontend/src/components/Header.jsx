import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-kmk-navy text-white py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+91 8074831140</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>homeskmk3@gmail.com</span>
            </div>
          </div>
          <div className="text-kmk-gold">
            Find Your Dream Home with KMK Homes
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-kmk-navy to-kmk-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">KMK</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-kmk-navy">KMK Homes</h1>
                <p className="text-sm text-gray-600">Premium Villas & Luxury Living</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 hover:text-kmk-gold ${
                    location.pathname === link.path
                      ? 'text-kmk-gold border-b-2 border-kmk-gold pb-1'
                      : 'text-kmk-navy'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className="hidden sm:block bg-kmk-gold hover:bg-kmk-gold/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Book Site Visit
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-kmk-navy hover:text-kmk-gold transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="bg-white border-t border-gray-100 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-kmk-gold border-l-4 border-kmk-gold pl-4'
                    : 'text-kmk-navy hover:text-kmk-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 bg-kmk-gold hover:bg-kmk-gold/90 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors duration-200"
            >
              Book Site Visit
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;