import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Home as HomeIcon, Ruler, Compass, Phone, Mail, MessageCircle, ArrowLeft, Check, ExternalLink, Expand } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const [propertyRes, propertiesRes] = await Promise.all([
        publicApi.getProperty(id),
        publicApi.getProperties({ status: 'Available', limit: 3 })
      ]);
      
      setProperty(propertyRes.data);
      // Filter out current property from similar properties
      setSimilarProperties(propertiesRes.data.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-600 mb-4">Property Not Found</h1>
          <Link to="/projects" className="text-kmk-gold hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery_images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.gallery_images.length) % property.gallery_images.length);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openImageModal = (index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => 
      prev === property.gallery_images.length - 1 ? 0 : prev + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => 
      prev === 0 ? property.gallery_images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button asChild variant="outline" className="border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white">
            <Link to="/projects">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery - Left Side */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative mb-4 rounded-2xl overflow-hidden cursor-pointer group">
              <img
                src={getImageUrl(property.gallery_images[currentImageIndex])}
                alt={`${property.villa_number} - Image ${currentImageIndex + 1}`}
                className="w-full h-96 md:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => openImageModal(currentImageIndex)}
              />
              
              {/* Expand Icon */}
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand size={20} />
              </div>
              
              {/* Navigation Arrows */}
              {property.gallery_images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {property.gallery_images.length}
              </div>

              {/* Status Badge */}
              <Badge className={`absolute top-4 left-4 text-sm ${
                property.status === 'Available' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}>
                {property.status}
              </Badge>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {property.gallery_images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'border-kmk-gold ring-2 ring-kmk-gold/30' 
                      : 'border-gray-200 hover:border-kmk-gold/50'
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-kmk-navy mb-2">{property.villa_number}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={18} className="mr-2 text-kmk-gold" />
                    <span>{property.location}</span>
                  </div>
                  <div className="text-2xl font-bold text-kmk-gold">{property.price_range}</div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Ruler size={24} className="mx-auto text-kmk-gold mb-2" />
                    <div className="font-semibold text-kmk-navy">{property.plot_size}</div>
                    <div className="text-sm text-gray-600">Sq. Yds</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <HomeIcon size={24} className="mx-auto text-kmk-gold mb-2" />
                    <div className="font-semibold text-kmk-navy">{property.built_up_area}</div>
                    <div className="text-sm text-gray-600">Sq. Ft</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center col-span-2">
                    <Compass size={24} className="mx-auto text-kmk-gold mb-2" />
                    <div className="font-semibold text-kmk-navy">{property.facing} Facing</div>
                    <div className="text-sm text-gray-600">Direction</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-kmk-navy mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{property.description}</p>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="font-bold text-kmk-navy mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {property.status === 'Available' && (
                    <>
                      <Button 
                        asChild 
                        className="w-full bg-kmk-gold hover:bg-kmk-gold/90 text-white"
                      >
                        <a
                          href={property.enquiry_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle size={16} className="mr-2" />
                          Enquire on WhatsApp
                        </a>
                      </Button>
                      <Button 
                        asChild 
                        variant="outline"
                        className="w-full border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white"
                      >
                        <Link to="/contact">
                          <Phone size={16} className="mr-2" />
                          Schedule Site Visit
                        </Link>
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <a
                      href={property.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={16} className="mr-2" />
                      View on Map <ExternalLink size={14} className="ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-kmk-navy text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Location & Connectivity</h2>
                <p className="text-gray-300">Explore the neighborhood and nearby amenities</p>
              </div>
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-sm text-gray-600 mb-4">Click the button below to view this property on Google Maps</p>
                  <Button 
                    asChild 
                    className="bg-kmk-gold hover:bg-kmk-gold/90"
                  >
                    <a
                      href={property.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps <ExternalLink size={16} className="ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-kmk-navy mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((similarProperty) => (
                <Card key={similarProperty._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={similarProperty.gallery_images && similarProperty.gallery_images.length > 0 ? getImageUrl(similarProperty.gallery_images[0]) : '/placeholder-villa.jpg'}
                      alt={similarProperty.villa_number}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-500">
                      {similarProperty.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-kmk-navy mb-2">{similarProperty.villa_number}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin size={14} className="mr-1" />
                      {similarProperty.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-kmk-gold">{similarProperty.price_range}</span>
                      <Button asChild size="sm" className="bg-kmk-navy hover:bg-kmk-navy/90">
                        <Link to={`/property/${similarProperty._id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;