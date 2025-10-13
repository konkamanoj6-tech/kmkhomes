import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Ruler, Youtube, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const PlotsListing = () => {
  const [filters, setFilters] = useState({
    location: '',
    plotArea: '',
    priceRange: '',
    propertyType: '',
    status: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const response = await publicApi.getPlots();
      setPlots(response.data || []);
    } catch (error) {
      console.error('Error fetching plots:', error);
      setPlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter options - all dynamic from data
  const locationOptions = [...new Set(plots.map(p => p.location))].sort();
  const propertyTypeOptions = [...new Set(plots.map(p => p.property_type))].sort();
  const statusOptions = [...new Set(plots.map(p => p.status))].sort();
  
  // Dynamic price range grouping
  const priceRangeOptions = useMemo(() => {
    const ranges = [
      { label: 'Under ₹50L', value: '0-50', min: 0, max: 50 },
      { label: '₹50L - ₹1Cr', value: '50-100', min: 50, max: 100 },
      { label: '₹1Cr - ₹2Cr', value: '100-200', min: 100, max: 200 },
      { label: 'Above ₹2Cr', value: '200+', min: 200, max: Infinity }
    ];
    return ranges;
  }, []);
  
  // Dynamic plot area ranges
  const plotAreaOptions = useMemo(() => {
    const areas = plots.map(p => {
      const match = p.plot_area.match(/(\d+)/);
      return match ? parseInt(match[0]) : 0;
    }).filter(a => a > 0);
    
    if (areas.length === 0) return [];
    
    const min = Math.min(...areas);
    const max = Math.max(...areas);
    
    const ranges = [];
    if (min < 150) ranges.push({ label: 'Under 150 sq.yds', value: '0-150' });
    if (max >= 150) ranges.push({ label: '150-300 sq.yds', value: '150-300' });
    if (max >= 300) ranges.push({ label: '300-500 sq.yds', value: '300-500' });
    if (max >= 500) ranges.push({ label: 'Above 500 sq.yds', value: '500+' });
    
    return ranges;
  }, [plots]);

  // Filter plots based on selected filters
  const filteredPlots = useMemo(() => {
    return plots.filter(plot => {
      if (filters.location && plot.location !== filters.location) return false;
      if (filters.propertyType && plot.property_type !== filters.propertyType) return false;
      if (filters.status && plot.status !== filters.status) return false;
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          plot.plot_name.toLowerCase().includes(searchLower) ||
          plot.location.toLowerCase().includes(searchLower) ||
          plot.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [plots, filters]);

  const resetFilters = () => {
    setFilters({
      location: '',
      plotArea: '',
      priceRange: '',
      propertyType: '',
      status: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Plot</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover open plots in prime and developing areas across the city.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 -mt-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by plot name, location..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  >
                    <option value="">All Locations</option>
                    {locationOptions.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    {propertyTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <Button variant="outline" onClick={resetFilters} className="w-full md:w-auto">
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredPlots.length} {filteredPlots.length === 1 ? 'Plot' : 'Plots'} Available
          </h2>
        </div>

        {filteredPlots.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No plots found matching your criteria.</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlots.map((plot) => (
              <Card key={plot._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getImageUrl(plot.main_image)}
                    alt={plot.plot_name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${
                      plot.status === 'Available'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {plot.status}
                  </Badge>
                  {plot.youtube_link && (
                    <a
                      href={plot.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                    >
                      <Youtube className="w-4 h-4" />
                      Watch Tour
                    </a>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {plot.plot_name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{plot.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{plot.plot_area}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Type: {plot.property_type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t">
                    <span className="text-2xl font-bold text-blue-600">
                      {plot.price_range}
                    </span>
                  </div>

                  <Link to={`/projects/plots/${plot._id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotsListing;
