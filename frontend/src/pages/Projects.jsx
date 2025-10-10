import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ArrowRight, Filter, Building2, Ruler, Square, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const Projects = () => {
  const location = useLocation();
  const [ourProjects, setOurProjects] = useState([]);
  const [budgetHomes, setBudgetHomes] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if there's a tab parameter in URL hash or default to 'our-projects'
  const getInitialTab = () => {
    const hash = location.hash.replace('#', '');
    if (['our-projects', 'budget-homes', 'plots'].includes(hash)) {
      return hash;
    }
    return 'our-projects';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    plot_size: '',
    built_up_area: '',
    facing: '',
    price: '',
    price_range: '',
    property_type: ''
  });

  const priceRangeOptions = ['Affordable', 'Mid-range', 'Premium'];
  const propertyTypeOptions = ['Apartment', 'Villa', 'Plot', 'Commercial'];
  const statusOptions = ['Available', 'Sold', 'Upcoming'];

  useEffect(() => {
    fetchProjectsData();
  }, []);

  // Update tab when location hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['our-projects', 'budget-homes', 'plots'].includes(hash)) {
      setActiveTab(hash);
      // Clear filters when tab changes
      setFilters({
        location: '',
        price_range: '',
        property_type: '',
        status: ''
      });
    }
  }, [location.hash]);

  const fetchProjectsData = async () => {
    try {
      const [ourProjectsRes, budgetHomesRes, plotsRes] = await Promise.all([
        publicApi.getOurProjects(),
        publicApi.getBudgetHomes(),
        publicApi.getPlots()
      ]);
      
      setOurProjects(ourProjectsRes.data || []);
      setBudgetHomes(budgetHomesRes.data || []);
      setPlots(plotsRes.data || []);
    } catch (error) {
      console.error('Error fetching projects data:', error);
      setOurProjects([]);
      setBudgetHomes([]);
      setPlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Get current data based on active tab
  const currentData = activeTab === 'our-projects' 
    ? ourProjects 
    : activeTab === 'budget-homes' 
    ? budgetHomes 
    : plots;
  
  // Filter options based on current data
  const locationOptions = [...new Set(currentData.map(p => p.location))].filter(Boolean);

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    return currentData.filter(project => {
      // Location filter
      if (filters.location && project.location !== filters.location) return false;
      
      // Price range filter (not applicable for plots)
      if (filters.price_range && activeTab !== 'plots' && project.price_range !== filters.price_range) return false;
      
      // Property type filter (not applicable for plots)
      if (filters.property_type && activeTab !== 'plots' && project.property_type !== filters.property_type) return false;
      
      // Status filter (for plots only)
      if (filters.status && activeTab === 'plots' && project.status !== filters.status) return false;
      
      return true;
    });
  }, [currentData, filters, activeTab]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      status: '',
      plot_size: '',
      built_up_area: '',
      facing: '',
      price: '',
      price_range: '',
      property_type: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Header */}
      <section className="bg-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our premium developments and budget-friendly homes designed for modern living.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setActiveTab('our-projects');
                  window.location.hash = 'our-projects';
                }}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'our-projects'
                    ? 'bg-kmk-navy text-white shadow-md'
                    : 'text-gray-600 hover:text-kmk-navy'
                }`}
              >
                Our Projects
              </button>
              <button
                onClick={() => {
                  setActiveTab('budget-homes');
                  window.location.hash = 'budget-homes';
                }}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'budget-homes'
                    ? 'bg-kmk-navy text-white shadow-md'
                    : 'text-gray-600 hover:text-kmk-navy'
                }`}
              >
                Budget Homes
              </button>
              <button
                onClick={() => {
                  setActiveTab('plots');
                  window.location.hash = 'plots';
                }}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'plots'
                    ? 'bg-kmk-navy text-white shadow-md'
                    : 'text-gray-600 hover:text-kmk-navy'
                }`}
              >
                Plots
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Price Range filter - not shown for plots */}
                {activeTab !== 'plots' && (
                  <select
                    value={filters.price_range}
                    onChange={(e) => handleFilterChange('price_range', e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  >
                    <option value="">All Price Ranges</option>
                    {priceRangeOptions.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                )}

                {/* Property Type filter - not shown for plots */}
                {activeTab !== 'plots' && (
                  <select
                    value={filters.property_type}
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
                  >
                    <option value="">All Property Types</option>
                    {propertyTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                )}

                {/* Status filter - only for plots */}
                {activeTab === 'plots' && (
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
                )}
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-600">
                    Showing {filteredProjects.length} of {currentData.length} {activeTab === 'plots' ? 'plots' : 'projects'}
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

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {activeTab === 'our-projects' 
                ? 'Our Premium Projects' 
                : activeTab === 'budget-homes'
                ? 'Homes for Every Budget'
                : 'Available Plots'
              }
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {activeTab === 'our-projects' 
                ? 'Discover our flagship developments designed with modern architecture and premium amenities.'
                : activeTab === 'budget-homes'
                ? 'Explore carefully curated homes from trusted builders that offer great value for money.'
                : 'Find premium plots and land investments in prime locations with excellent connectivity.'
              }
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl text-gray-300 mb-4">⏳</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Loading projects...</h3>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl text-gray-300 mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or check back later for new projects.</p>
              <Button onClick={clearFilters} className="bg-kmk-gold hover:bg-kmk-gold/90">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project._id} className="group overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" 
                      style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(activeTab === 'plots' ? project.main_image : project.thumbnail_image)}
                      alt={activeTab === 'plots' ? project.title : project.project_name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    
                    {/* Badge - Price Range for projects, Status for plots */}
                    {activeTab === 'plots' ? (
                      <Badge className={`absolute top-4 left-4 ${
                        project.status === 'Available' ? 'bg-green-500' :
                        project.status === 'Sold' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}>
                        {project.status}
                      </Badge>
                    ) : (
                      <Badge className={`absolute top-4 left-4 ${
                        project.price_range === 'Affordable' ? 'bg-green-500' :
                        project.price_range === 'Mid-range' ? 'bg-blue-500' :
                        'bg-purple-500'
                      } hover:bg-opacity-90 transition-colors duration-200`}>
                        {project.price_range}
                      </Badge>
                    )}
                    
                    {/* Property Type Badge - only for projects */}
                    {activeTab !== 'plots' && (
                      <Badge variant="outline" className="absolute top-4 right-4 bg-white/90 text-gray-700">
                        {project.property_type}
                      </Badge>
                    )}

                    {/* YouTube Button */}
                    {project.youtube_link && (
                      <Button
                        onClick={() => window.open(project.youtube_link, '_blank')}
                        size="sm"
                        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-110 transition-all duration-200"
                        style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      >
                        <Play size={14} className="mr-1" />
                        Watch Tour
                      </Button>
                    )}

                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-kmk-navy mb-2 group-hover:text-kmk-gold transition-colors duration-200">
                        {activeTab === 'plots' ? project.title : project.project_name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin size={16} className="mr-2 flex-shrink-0 text-kmk-gold" />
                        <span className="text-sm">{project.location}</span>
                      </div>

                      {/* Show plot details for plots */}
                      {activeTab === 'plots' && (
                        <div className="space-y-1 mb-3 text-sm text-gray-600">
                          {project.area_sqyds && (
                            <div className="flex items-center">
                              <Square size={14} className="mr-2 text-kmk-gold" />
                              <span>{project.area_sqyds} Sq.Yds</span>
                            </div>
                          )}
                          {project.area_sqft && (
                            <div className="flex items-center">
                              <Ruler size={14} className="mr-2 text-kmk-gold" />
                              <span>{project.area_sqft} Sq.Ft</span>
                            </div>
                          )}
                          <div className="font-semibold text-kmk-gold">{project.price_range}</div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                      {project.short_description}
                    </p>
                    
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button 
                        className="flex-1 bg-kmk-navy hover:bg-kmk-navy/90 text-white transform hover:scale-105 transition-all duration-200"
                        style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onClick={() => window.open('/contact', '_self')}
                      >
                        Get Details
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                      
                      {project.youtube_link && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(project.youtube_link, '_blank')}
                          className="border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white transform hover:scale-105 transition-all duration-200"
                          style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        >
                          <Play size={14} />
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
          <h2 className="text-4xl font-bold mb-6">Find Your Perfect Home</h2>
          <p className="text-xl mb-8 text-gray-300">
            Whether you're looking for premium luxury or budget-friendly options, we're here to help you find your ideal home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 text-white px-8 py-4">
              <Link to="/contact">Schedule Site Visit</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <a href="https://wa.me/918074831140" target="_blank" rel="noopener noreferrer">
                WhatsApp Enquiry
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;