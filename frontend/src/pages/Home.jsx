import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Home as HomeIcon, Ruler, Compass, Calendar, ArrowRight, Star, CheckCircle, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    facing: '',
    plotSize: '',
    builtUpArea: ''
  });
  const [homeBanners, setHomeBanners] = useState([]);
  const [ourProjects, setOurProjects] = useState([]);
  const [budgetHomes, setBudgetHomes] = useState([]);
  const [plots, setPlots] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [plotSizeRanges, setPlotSizeRanges] = useState([]);
  const [builtUpAreaRanges, setBuiltUpAreaRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters for each section
  const [ourProjectsFilters, setOurProjectsFilters] = useState({
    location: '',
    facing: '',
    plot_size: '',
    built_up_area: '',
    status: ''
  });
  
  const [budgetHomesFilters, setBudgetHomesFilters] = useState({
    price: '',
    property_type: ''
  });
  
  const [plotsFilters, setPlotsFilters] = useState({
    location: '',
    facing: '',
    status: '',
    plot_size: ''
  });

  // Dynamic filter options from actual data
  const ourProjectLocations = [...new Set(ourProjects.map(p => p.location))].filter(Boolean).sort();
  const ourProjectFacings = [...new Set(ourProjects.map(p => p.facing))].filter(Boolean).sort();
  const ourProjectStatuses = [...new Set(ourProjects.map(p => p.status))].filter(Boolean).sort();
  const ourProjectPlotSizes = [...new Set(ourProjects.map(p => p.plot_size))].filter(Boolean).sort((a,b) => a-b);
  const ourProjectBuiltUpAreas = [...new Set(ourProjects.map(p => p.built_up_area))].filter(Boolean).sort((a,b) => a-b);

  const budgetHomePrices = [...new Set(budgetHomes.map(p => p.price))].filter(Boolean).sort();
  const budgetHomePropertyTypes = [...new Set(budgetHomes.map(p => p.property_type))].filter(Boolean).sort();

  const plotLocations = [...new Set(plots.map(p => p.location))].filter(Boolean).sort();
  const plotFacings = [...new Set(plots.map(p => p.facing))].filter(Boolean).sort();
  const plotStatuses = [...new Set(plots.map(p => p.status))].filter(Boolean).sort();
  const plotSizes = [...new Set(plots.map(p => p.area_sqyds))].filter(Boolean).sort((a,b) => a-b);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [
        bannersRes, 
        allPropertiesRes, 
        ourProjectsRes,
        budgetHomesRes,
        plotsRes,
        testimonialsRes
      ] = await Promise.all([
        publicApi.getHomeBanners(),
        publicApi.getProperties(),
        publicApi.getOurProjects({ featured: true }),
        publicApi.getBudgetHomes({ featured: true }),
        publicApi.getPlots({ featured: true }),
        publicApi.getTestimonials({ featured: true, limit: 3 })
      ]);

      const properties = allPropertiesRes.data || [];
      setHomeBanners(bannersRes.data);
      setAllProperties(properties);
      setOurProjects((ourProjectsRes.data || []).slice(0, 4));
      setBudgetHomes((budgetHomesRes.data || []).slice(0, 4));
      setPlots((plotsRes.data || []).slice(0, 4));
      setTestimonials(testimonialsRes.data);

      // Calculate dynamic ranges from actual property data for villa finder
      if (properties.length > 0) {
        const plotSizes = properties.map(p => p.plot_size).filter(size => size);
        const builtUpAreas = properties.map(p => p.built_up_area).filter(area => area);

        // Create plot size ranges based on actual data
        const minPlot = Math.min(...plotSizes);
        const maxPlot = Math.max(...plotSizes);
        const plotRanges = generateRanges(minPlot, maxPlot, 'Sq.Yds');
        setPlotSizeRanges(plotRanges);

        // Create built-up area ranges based on actual data
        const minBuiltUp = Math.min(...builtUpAreas);
        const maxBuiltUp = Math.max(...builtUpAreas);
        const builtUpRanges = generateRanges(minBuiltUp, maxBuiltUp, 'Sq.Ft');
        setBuiltUpAreaRanges(builtUpRanges);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate ranges based on min/max values
  const generateRanges = (min, max, unit) => {
    const ranges = [];
    const diff = max - min;
    const step = Math.ceil(diff / 3); // Create 3 ranges

    if (diff <= 100) {
      // If range is small, create specific ranges
      ranges.push({
        label: `${min}-${min + step} ${unit}`,
        value: `${min}-${min + step}`
      });
      ranges.push({
        label: `${min + step + 1}-${max} ${unit}`,
        value: `${min + step + 1}-${max}`
      });
    } else {
      // Create 3 ranges
      const range1End = min + step;
      const range2End = range1End + step;
      
      ranges.push({
        label: `${min}-${range1End} ${unit}`,
        value: `${min}-${range1End}`
      });
      ranges.push({
        label: `${range1End + 1}-${range2End} ${unit}`,
        value: `${range1End + 1}-${range2End}`
      });
      ranges.push({
        label: `${range2End + 1}+ ${unit}`,
        value: `${range2End + 1}+`
      });
    }

    return ranges;
  };

  const heroImages = homeBanners.length > 0 
    ? homeBanners.map(banner => banner.image_url)
    : [
        "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/e9f5ygj3_IMG_9413.jpeg",
        "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/o0b7p5qk_IMG_9414.jpeg",
        "https://customer-assets.emergentagent.com/job_luxrealestate/artifacts/6wd7nnfd_IMG_9415.jpeg"
      ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const stats = [
    { number: "50+", label: "Projects Delivered", icon: HomeIcon },
    { number: "1000+", label: "Happy Families", icon: Star },
    { number: "15+", label: "Years Experience", icon: Calendar },
    { number: "100%", label: "Customer Satisfaction", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Villa ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-6xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Dream Home
              <span className="block text-kmk-gold">with KMK Homes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience luxury living in our premium villas with world-class amenities, 
              modern architecture, and prime locations across Hyderabad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 text-white px-8 py-4 text-lg">
                <Link to="/projects">View All Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4 text-lg">
                <Link to="/contact">Book a Site Visit</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-kmk-gold scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Search Widget */}
      <section className="relative -mt-20 z-30 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-kmk-navy mb-6 text-center">Find Your Perfect Villa</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
                
                <select
                  value={filters.facing}
                  onChange={(e) => handleFilterChange('facing', e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                >
                  <option value="">All Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South-East">South-East</option>
                </select>
                
                <select
                  value={filters.plotSize}
                  onChange={(e) => handleFilterChange('plotSize', e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                >
                  <option value="">Plot Size (Sq.Yds)</option>
                  {plotSizeRanges.map((range, index) => (
                    <option key={index} value={range.value}>{range.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.builtUpArea}
                  onChange={(e) => handleFilterChange('builtUpArea', e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                >
                  <option value="">Built-up Area (Sq.Ft)</option>
                  {builtUpAreaRanges.map((range, index) => (
                    <option key={index} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              <Button asChild className="w-full bg-kmk-navy hover:bg-kmk-navy/90 text-white py-3">
                <Link to="/projects">Search Properties</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-kmk-navy mb-4">Our Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our flagship developments designed with modern architecture and premium amenities.
            </p>
          </div>

          {/* Mini Filters for Our Projects */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <select
              value={ourProjectsFilters.location}
              onChange={(e) => setOurProjectsFilters(prev => ({...prev, location: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Locations</option>
              {ourProjectLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={ourProjectsFilters.facing}
              onChange={(e) => setOurProjectsFilters(prev => ({...prev, facing: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Facing</option>
              {ourProjectFacings.map(facing => (
                <option key={facing} value={facing}>{facing}</option>
              ))}
            </select>
            <select
              value={ourProjectsFilters.status}
              onChange={(e) => setOurProjectsFilters(prev => ({...prev, status: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Status</option>
              {ourProjectStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={ourProjectsFilters.plot_size}
              onChange={(e) => setOurProjectsFilters(prev => ({...prev, plot_size: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Plot Sizes</option>
              {ourProjectPlotSizes.map(size => (
                <option key={size} value={size}>{size} Sq.Yds</option>
              ))}
            </select>
            <select
              value={ourProjectsFilters.built_up_area}
              onChange={(e) => setOurProjectsFilters(prev => ({...prev, built_up_area: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Built-up Areas</option>
              {ourProjectBuiltUpAreas.map(area => (
                <option key={area} value={area}>{area} Sq.Ft</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ourProjects.map((project) => (
              <Card key={project._id} className="group overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" 
                    style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(project.thumbnail_image)}
                    alt={project.project_name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <Badge className={`absolute top-3 left-3 ${
                    project.price_range === 'Affordable' ? 'bg-green-500' :
                    project.price_range === 'Mid-range' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}>
                    {project.price_range}
                  </Badge>
                  
                  {project.youtube_link && (
                    <Button
                      onClick={() => window.open(project.youtube_link, '_blank')}
                      size="sm"
                      className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-110 transition-all duration-300"
                    >
                      <Play size={12} className="mr-1" />
                      Tour
                    </Button>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-kmk-navy mb-2 group-hover:text-kmk-gold transition-colors duration-300">
                    {project.project_name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-2 text-kmk-gold" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {project.short_description}
                  </p>
                  
                  <Button 
                    asChild 
                    className="w-full bg-kmk-navy hover:bg-kmk-navy/90 text-white transform hover:scale-105 transition-all duration-300"
                  >
                    <Link to="/contact">Get Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white">
              <Link to="/projects#our-projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Homes for Every Budget Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-kmk-navy mb-4">Homes for Every Budget</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore carefully curated homes from trusted builders that offer great value for money.
            </p>
          </div>

          {/* Mini Filters for Budget Homes */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <select
              value={budgetHomesFilters.price}
              onChange={(e) => setBudgetHomesFilters(prev => ({...prev, price: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Prices</option>
              {budgetHomePrices.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
            <select
              value={budgetHomesFilters.property_type}
              onChange={(e) => setBudgetHomesFilters(prev => ({...prev, property_type: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Types</option>
              {budgetHomePropertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {budgetHomes.map((home) => (
              <Card key={home._id} className="group overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" 
                    style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(home.thumbnail_image)}
                    alt={home.project_name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <Badge className={`absolute top-3 left-3 ${
                    home.price_range === 'Affordable' ? 'bg-green-500' :
                    home.price_range === 'Mid-range' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}>
                    {home.price_range}
                  </Badge>
                  
                  {home.youtube_link && (
                    <Button
                      onClick={() => window.open(home.youtube_link, '_blank')}
                      size="sm"
                      className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-110 transition-all duration-300"
                    >
                      <Play size={12} className="mr-1" />
                      Tour
                    </Button>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-kmk-navy mb-2 group-hover:text-kmk-gold transition-colors duration-300">
                    {home.project_name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-2 text-kmk-gold" />
                    <span className="text-sm">{home.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {home.short_description}
                  </p>
                  
                  <Button 
                    asChild 
                    className="w-full bg-kmk-gold hover:bg-kmk-gold/90 text-white transform hover:scale-105 transition-all duration-300"
                  >
                    <Link to="/contact">Get Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white">
              <Link to="/projects#budget-homes">View More Homes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Find Your Perfect Plot Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-kmk-navy mb-4">Find Your Perfect Plot</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium plots and land investments in prime locations with excellent connectivity.
            </p>
          </div>

          {/* Mini Filters for Plots */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <select
              value={plotsFilters.location}
              onChange={(e) => setPlotsFilters(prev => ({...prev, location: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Locations</option>
              {plotLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={plotsFilters.facing}
              onChange={(e) => setPlotsFilters(prev => ({...prev, facing: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Facing</option>
              {plotFacings.map(facing => (
                <option key={facing} value={facing}>{facing}</option>
              ))}
            </select>
            <select
              value={plotsFilters.status}
              onChange={(e) => setPlotsFilters(prev => ({...prev, status: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Status</option>
              {plotStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={plotsFilters.plot_size}
              onChange={(e) => setPlotsFilters(prev => ({...prev, plot_size: e.target.value}))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold"
            >
              <option value="">All Plot Sizes</option>
              {plotSizes.map(size => (
                <option key={size} value={size}>{size} Sq.Yds</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plots.map((plot) => (
              <Card key={plot._id} className="group overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" 
                    style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(plot.main_image)}
                    alt={plot.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <Badge className={`absolute top-3 left-3 ${
                    plot.status === 'Available' ? 'bg-green-500' :
                    plot.status === 'Sold' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}>
                    {plot.status}
                  </Badge>
                  
                  {plot.youtube_link && (
                    <Button
                      onClick={() => window.open(plot.youtube_link, '_blank')}
                      size="sm"
                      className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-110 transition-all duration-300"
                    >
                      <Play size={12} className="mr-1" />
                      Tour
                    </Button>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-kmk-navy mb-2 group-hover:text-kmk-gold transition-colors duration-300">
                    {plot.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-2 text-kmk-gold" />
                    <span className="text-sm">{plot.location}</span>
                  </div>

                  <div className="space-y-1 mb-4 text-sm">
                    {plot.area_sqyds && (
                      <div className="flex items-center text-gray-600">
                        <Ruler size={14} className="mr-2 text-kmk-gold" />
                        <span>{plot.area_sqyds} Sq.Yds</span>
                      </div>
                    )}
                    <div className="font-semibold text-kmk-gold">{plot.price_range}</div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {plot.short_description}
                  </p>
                  
                  <Button 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-all duration-300"
                  >
                    <Link to="/contact">Get Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              <Link to="/projects#plots">Explore Plots</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-kmk-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-kmk-gold" />
                  </div>
                  <div className="text-4xl font-bold text-kmk-gold mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-kmk-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-kmk-navy mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real stories from our satisfied homeowners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-kmk-navy">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.testimonial}"</p>
                  <div className="flex text-kmk-gold mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-kmk-navy to-kmk-navy/90 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-12 text-gray-300">
            Join hundreds of satisfied families who have made KMK Homes their trusted choice 
            for luxury villa living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 text-white px-8 py-4">
              <Link to="/contact">Schedule Site Visit</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <Link to="/projects">Explore Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;