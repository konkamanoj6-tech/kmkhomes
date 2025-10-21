import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Ruler, Phone, Mail, MessageCircle, ArrowLeft, Check, Expand } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const PlotDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPlot();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal) return;
      
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowLeft') {
        prevModalImage();
      } else if (e.key === 'ArrowRight') {
        nextModalImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, modalImageIndex, plot?.gallery_images?.length]);

  const fetchPlot = async () => {
    try {
      const response = await publicApi.getPlot(id);
      setPlot(response.data);
    } catch (error) {
      console.error('Error fetching plot:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading plot details...</div>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-600 mb-4">Plot Not Found</h1>
          <Link to="/projects/plots" className="text-blue-600 hover:underline">
            Back to Plots
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [plot.main_image, ...(plot.gallery_images || [])];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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
    setModalImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeVideoId = getYouTubeVideoId(plot.youtube_link);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/projects/plots" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Plots
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={getImageUrl(allImages[currentImageIndex])}
                  alt={`${plot.plot_name} - ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => openImageModal(currentImageIndex)}
                />
                <Button 
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700"
                  onClick={() => openImageModal(currentImageIndex)}
                >
                  <Expand className="w-4 h-4 mr-2" />
                  Expand
                </Button>
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
                <Badge 
                  className={`absolute top-4 left-4 ${
                    plot.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {plot.status}
                </Badge>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-2">
                  {allImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-full h-20 object-cover rounded cursor-pointer transition ${
                        idx === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => selectImage(idx)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Plot Details */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {plot.plot_name}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold">{plot.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Ruler className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Plot Area</p>
                      <p className="font-semibold">{plot.plot_area}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold">{plot.property_type}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{plot.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* YouTube Video */}
            {youtubeVideoId && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Video Tour</h3>
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title="Plot Video Tour"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Price & Contact */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Price Range</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {plot.price_range}
                  </p>
                </div>

                <div className="space-y-3">
                  <a href="tel:+919791662929">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <a href={`https://wa.me/919014060147?text=Hi, I'm interested in ${plot.plot_name}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href="mailto:homeskmk3@gmail.com">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Inquiry
                    </Button>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Quick Details</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-blue-600" />
                      Status: {plot.status}
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-blue-600" />
                      Type: {plot.property_type}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold z-10"
          >
            ✕ Close
          </button>
          
          <div className="relative w-full max-w-6xl">
            <img
              src={getImageUrl(allImages[modalImageIndex])}
              alt={`${plot.plot_name} - ${modalImageIndex + 1}`}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {modalImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlotDetail;
