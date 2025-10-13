import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Ruler, Compass, Youtube, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const BudgetHomesListing = () => {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    propertyType: '',
    facing: '',
    status: '',
    builtUpArea: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await publicApi.getBudgetHomes();
      setHomes(response.data || []);
    } catch (error) {
      console.error('Error fetching budget homes:', error);
      setHomes([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter options - all dynamic from data
  const locationOptions = [...new Set(homes.map(h => h.location))].sort();
  const propertyTypeOptions = [...new Set(homes.map(h => h.property_type))].sort();
  const facingOptions = [...new Set(homes.map(h => h.facing))].sort();
  const statusOptions = [...new Set(homes.map(h => h.status))].sort();
  
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
  
  // Dynamic built-up area ranges
  const builtUpAreaOptions = useMemo(() => {
    const areas = homes.map(h => {
      const match = h.built_up_area.match(/(\d+)/);
      return match ? parseInt(match[0]) : 0;
    }).filter(a => a > 0);
    
    if (areas.length === 0) return [];
    
    const min = Math.min(...areas);
    const max = Math.max(...areas);
    
    const ranges = [];
    if (min < 1000) ranges.push({ label: 'Under 1000 sq.ft', value: '0-1000' });
    if (max >= 1000) ranges.push({ label: '1000-1500 sq.ft', value: '1000-1500' });
    if (max >= 1500) ranges.push({ label: '1500-2000 sq.ft', value: '1500-2000' });
    if (max >= 2000) ranges.push({ label: '2000-2500 sq.ft', value: '2000-2500' });
    if (max >= 2500) ranges.push({ label: 'Above 2500 sq.ft', value: '2500+' });
    
    return ranges;
  }, [homes]);

  // Filter homes based on selected filters
  const filteredHomes = useMemo(() => {
    return homes.filter(home => {
      if (filters.location && home.location !== filters.location) return false;
      if (filters.propertyType && home.property_type !== filters.propertyType) return false;
      if (filters.facing && home.facing !== filters.facing) return false;
      if (filters.status && home.status !== filters.status) return false;
      
      // Price range filter
      if (filters.priceRange) {
        const priceText = home.price_range.toLowerCase();
        const priceMatch = priceText.match(/(\d+)/g);
        if (priceMatch) {
          const minPrice = parseInt(priceMatch[0]);
          const [rangeMin, rangeMax] = filters.priceRange.split('-');
          
          if (rangeMax === '+') {
            if (minPrice < parseInt(rangeMin)) return false;
          } else {
            if (minPrice < parseInt(rangeMin) || minPrice > parseInt(rangeMax)) return false;
          }
        }
      }
      
      // Built-up area filter
      if (filters.builtUpArea) {
        const areaMatch = home.built_up_area.match(/(\d+)/);
        if (areaMatch) {
          const area = parseInt(areaMatch[0]);
          const [rangeMin, rangeMax] = filters.builtUpArea.split('-');
          
          if (rangeMax === '+') {
            if (area < parseInt(rangeMin)) return false;
          } else {
            if (area < parseInt(rangeMin) || area > parseInt(rangeMax)) return false;
          }
        }
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          home.property_name.toLowerCase().includes(searchLower) ||
          home.location.toLowerCase().includes(searchLower) ||
          home.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [homes, filters]);

  const resetFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      propertyType: '',
      facing: '',
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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Homes for Every Budget</h1>
          <p className="text-xl text-emerald-100 max-w-2xl">
            Explore thoughtfully curated affordable and mid-range homes for every lifestyle.
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
                  placeholder="Search by property name, location..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  >
                    <option value="">All Prices</option>
                    {priceRangeOptions.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
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
                  <label className="block text-sm font-medium mb-2">Facing</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.facing}
                    onChange={(e) => setFilters({ ...filters, facing: e.target.value })}
                  >
                    <option value="">All Directions</option>
                    {facingOptions.map(face => (
                      <option key={face} value={face}>{face}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Built-up Area</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={filters.builtUpArea}
                    onChange={(e) => setFilters({ ...filters, builtUpArea: e.target.value })}
                  >
                    <option value="">All Sizes</option>
                    {builtUpAreaOptions.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
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
            {filteredHomes.length} {filteredHomes.length === 1 ? 'Home' : 'Homes'} Available
          </h2>
        </div>

        {filteredHomes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No homes found matching your criteria.</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomes.map((home) => (
              <Card key={home._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getImageUrl(home.main_image)}
                    alt={home.property_name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${
                      home.status === 'Available'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {home.status}
                  </Badge>
                  {home.youtube_link && (
                    <a
                      href={home.youtube_link}
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
                    {home.property_name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm">{home.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <HomeIcon className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm">{home.property_type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm">{home.built_up_area}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Compass className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm">{home.facing} Facing</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t">
                    <span className="text-2xl font-bold text-emerald-600">
                      {home.price_range}
                    </span>
                  </div>

                  <Link to={`/projects/homes-for-every-budget/${home._id}`}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
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

export default BudgetHomesListing;
