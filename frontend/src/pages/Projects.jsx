import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Ruler, Compass, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';

const Projects = () => {
  const [filters, setFilters] = useState({
    status: '',
    facing: '',
    plotSizeRange: '',
    builtUpAreaRange: '',
    location: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await publicApi.getProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter options
  const statusOptions = [...new Set(properties.map(p => p.status))];
  const facingOptions = [...new Set(properties.map(p => p.facing))];
  const locationOptions = [...new Set(properties.map(p => p.location))];

  const plotSizeRanges = [
    { label: '1500-2000 Sq.Yds', value: '1500-2000' },
    { label: '2000-2500 Sq.Yds', value: '2000-2500' },
    { label: '2500+ Sq.Yds', value: '2500+' }
  ];

  const builtUpAreaRanges = [
    { label: '2000-2500 Sq.Ft', value: '2000-2500' },
    { label: '2500-3000 Sq.Ft', value: '2500-3000' },
    { label: '3000+ Sq.Ft', value: '3000+' }
  ];

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Status filter
      if (filters.status && property.status !== filters.status) return false;
      
      // Facing filter
      if (filters.facing && property.facing !== filters.facing) return false;
      
      // Location filter
      if (filters.location && property.location !== filters.location) return false;
      
      // Plot size range filter
      if (filters.plotSizeRange) {
        const [min, max] = filters.plotSizeRange.split('-').map(Number);
        if (max) {
          if (property.plot_size < min || property.plot_size > max) return false;
        } else {
          if (property.plot_size < min) return false;
        }
      }
      
      // Built-up area range filter
      if (filters.builtUpAreaRange) {
        const [min, max] = filters.builtUpAreaRange.split('-').map(Number);
        if (max) {
          if (property.built_up_area < min || property.built_up_area > max) return false;
        } else {
          if (property.built_up_area < min) return false;
        }
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          property.villa_number.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      facing: '',
      plotSizeRange: '',
      builtUpAreaRange: '',
      location: '',
      searchTerm: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Header */}
      <section className="bg-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Premium Projects</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our collection of luxury villas designed with modern architecture, 
            premium amenities, and prime locations across Hyderabad.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by villa number, location..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white"
            >
              <Filter size={16} className="mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <select
                  value={filters.facing}
                  onChange={(e) => handleFilterChange('facing', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                >
                  <option value="">All Facing</option>
                  {facingOptions.map(facing => (
                    <option key={facing} value={facing}>{facing}</option>
                  ))}
                </select>

                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                >
                  <option value="">All Locations</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={filters.plotSizeRange}
                  onChange={(e) => handleFilterChange('plotSizeRange', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                >
                  <option value="">Plot Size</option>
                  {plotSizeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>

                <select
                  value={filters.builtUpAreaRange}
                  onChange={(e) => handleFilterChange('builtUpAreaRange', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                >
                  <option value="">Built-up Area</option>
                  {builtUpAreaRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-600">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </span>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-kmk-navy"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl text-gray-300 mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or clear the filters.</p>
              <Button onClick={clearFilters} className="bg-kmk-gold hover:bg-kmk-gold/90">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                  <div className="relative overflow-hidden">
                    <img
                      src={property.gallery_images[0]}
                      alt={property.villa_number}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className={`absolute top-4 left-4 ${
                      property.status === 'Available' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}>
                      {property.status}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {property.gallery_images.length} Photos
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-kmk-navy">{property.villa_number}</h3>
                      <span className="text-lg font-bold text-kmk-gold">{property.price_range}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-2 flex-shrink-0 text-kmk-gold" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <Ruler size={16} className="mr-2 text-kmk-gold" />
                        <span>{property.plot_size} Sq.Yds</span>
                      </div>
                      <div className="flex items-center">
                        <HomeIcon size={16} className="mr-2 text-kmk-gold" />
                        <span>{property.built_up_area} Sq.Ft</span>
                      </div>
                      <div className="flex items-center">
                        <Compass size={16} className="mr-2 text-kmk-gold" />
                        <span>{property.facing} Facing</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {property.description}
                    </p>
                    
                    <div className="flex gap-3">
                      <Button asChild className="flex-1 bg-kmk-navy hover:bg-kmk-navy/90">
                        <Link to={`/property/${property.id}`}>
                          View Details <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </Button>
                      {property.status === 'Available' && (
                        <Button 
                          asChild 
                          variant="outline" 
                          className="border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white"
                        >
                          <a
                            href={property.enquiry_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Enquire
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Didn't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Let us help you find your perfect villa. Contact our expert team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 text-white px-8 py-4">
              <Link to="/contact">Contact Our Team</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;