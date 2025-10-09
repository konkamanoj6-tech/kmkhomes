import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Waves, Dumbbell, Trees, Car, Wifi, Camera, Users, Gamepad2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { publicApi } from '../services/api';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [amenitiesRes, propertiesRes] = await Promise.all([
        publicApi.getAmenities(),
        publicApi.getProperties()
      ]);
      setAmenities(amenitiesRes.data);
      setProperties(propertiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allAmenities = [
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance, trained guards, and controlled access gates for complete safety."
    },
    {
      icon: Zap, 
      title: "Power & Water Backup",
      description: "Uninterrupted power supply with diesel generators, solar panels, and reliable water supply with overhead tanks."
    },
    {
      icon: Waves,
      title: "Swimming Pool Complex", 
      description: "Luxurious swimming pool with separate kids section, poolside seating, and professional maintenance services."
    },
    {
      icon: Dumbbell,
      title: "Modern Fitness Center",
      description: "Fully equipped gymnasium with latest cardio and strength training equipment, yoga studio, and certified trainers."
    },
    {
      icon: Trees,
      title: "Landscaped Gardens",
      description: "Beautiful green spaces with walking paths, meditation areas, outdoor seating, and recreational zones for families."
    },
    {
      icon: Car, 
      title: "Covered Parking",
      description: "Secure covered parking spaces for residents and guests with EV charging stations and vehicle maintenance area."
    },
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Fiber optic internet connectivity throughout the community with WiFi zones in common areas."
    },
    {
      icon: Camera,
      title: "Smart Home Features",
      description: "Integrated smart home systems with video door bells, automated lighting, and climate control systems."
    },
    {
      icon: Users,
      title: "Clubhouse & Community Hall",
      description: "Spacious clubhouse with event halls, party areas, library, and spaces for social gatherings and celebrations."
    },
    {
      icon: Gamepad2,
      title: "Kids Play Area",
      description: "Safe and colorful play zones with modern equipment, sand pits, swings, and supervised activity areas."
    }
  ];

  const lifestyleFeatures = [
    {
      title: "Premium Living",
      description: "Experience luxury at every corner with world-class amenities and services"
    },
    {
      title: "Family Friendly",
      description: "Safe and secure environment perfect for families with children"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive fitness and wellness facilities for a healthy lifestyle"
    },
    {
      title: "Entertainment",
      description: "Multiple recreational options for relaxation and social activities"
    }
  ];

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Hero Section */}
      <section className="relative bg-kmk-navy text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop"
            alt="Luxury Amenities"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">World-Class Amenities</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover luxury living redefined with premium amenities designed to enhance your lifestyle 
            and create memorable experiences for you and your family.
          </p>
          <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90">
            <Link to="/projects">Explore Our Projects</Link>
          </Button>
        </div>
      </section>

      {/* Lifestyle Features Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Luxury Lifestyle Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every aspect of our communities is designed to provide you with an unparalleled living experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lifestyleFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-kmk-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-kmk-gold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-kmk-navy mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Premium Amenities</h2>
            <p className="text-xl text-gray-600">
              Everything you need for a comfortable and luxurious lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allAmenities.map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-kmk-navy rounded-lg flex items-center justify-center mb-4">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-kmk-navy mb-3">{amenity.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{amenity.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sustainability Features */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Sustainable Living</h2>
            <p className="text-xl text-gray-600">
              Eco-friendly features for a greener tomorrow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌱",
                title: "Solar Power Integration",
                description: "Rooftop solar panels in every villa for renewable energy and reduced electricity costs"
              },
              {
                icon: "💧",
                title: "Rainwater Harvesting", 
                description: "Advanced rainwater collection and storage systems for water conservation"
              },
              {
                icon: "♻️",
                title: "Waste Management",
                description: "Segregated waste collection and composting facilities for organic waste"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-kmk-navy mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Removed Amenities Gallery images as requested */}

      {/* Dynamic Property Specifications */}
      {properties.length > 0 && (
        <section className="py-20 bg-kmk-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-kmk-navy mb-4">Property Specifications</h2>
              <p className="text-xl text-gray-600">
                Explore the variety of plot sizes and built-up areas available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <Card key={property._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-kmk-navy mb-3">{property.villa_number}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Plot Size:</span>
                        <span className="font-semibold">{property.plot_size} Sq.Yds</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Built-up Area:</span>
                        <span className="font-semibold">{property.built_up_area} Sq.Ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Facing:</span>
                        <span className="font-semibold">{property.facing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-semibold ${
                          property.status === 'Available' ? 'text-green-600' : 'text-red-600'
                        }`}>{property.status}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="font-medium">Price:</span>
                          <span className="font-bold text-kmk-gold">{property.price_range}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Experience Luxury Living</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't just take our word for it. Visit our projects and experience these world-class amenities firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 px-8 py-4">
              <Link to="/contact">
                Schedule a Visit <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <Link to="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Amenities;