import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, MapPin, Calendar, ArrowRight, Users, Award, Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { testimonials } from '../data/mock';

const HappyClients = () => {
  const clientStories = [
    {
      id: 1,
      name: "Anand & Priya Kumar",
      location: "Jubilee Hills Villa",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      date: "December 2023",
      story: "We always dreamed of owning a luxury villa in Hyderabad. KMK Homes made this dream a reality with their exceptional service and attention to detail. From the initial consultation to the final handover, every step was smooth and transparent. The quality of construction exceeded our expectations, and the amenities are world-class. Our children love the swimming pool and play areas, while we enjoy the peaceful community environment.",
      property: "Ultra Luxury Triplex Villa - 3200 Sq.Ft",
      rating: 5,
      videoThumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      name: "Dr. Rajesh Sharma",
      location: "Banjara Hills Villa",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      date: "October 2023",
      story: "As a busy professional, I needed a home that offered both luxury and convenience. KMK Homes delivered exactly that. The location is perfect for my daily commute, and the smart home features make life so much easier. The team was incredibly professional and accommodated all our specific requirements. The build quality is outstanding, and even after a year, everything is in perfect condition. Highly recommend KMK Homes to anyone looking for premium villas.",
      property: "Contemporary Villa - 2800 Sq.Ft",
      rating: 5,
      videoThumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      name: "Meera & Suresh Reddy",
      location: "Gachibowli Villa",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      date: "August 2023",
      story: "Moving from the US back to India, we were particular about finding a home that matched international standards. KMK Homes not only met but exceeded our expectations. The construction quality, finishing, and overall design philosophy is truly world-class. The NRI services were exceptional - they handled all the documentation while we were abroad. The property management team ensures everything is well-maintained. We couldn't be happier with our investment decision.",
      property: "Premium Villa - 3000 Sq.Ft",
      rating: 5,
      videoThumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      name: "Vikram & Deepika Patel",
      location: "Madhapur Villa",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      date: "June 2023",
      story: "We visited multiple builders before choosing KMK Homes, and we're so glad we made this choice. The transparency in pricing, quality of materials, and timely delivery impressed us the most. Our villa has become the perfect space for hosting family gatherings and creating beautiful memories. The kids' play area is safe and well-designed, and the community feel is amazing. The after-sales service is also commendable - they respond promptly to any queries or maintenance requests.",
      property: "Luxury Villa - 3400 Sq.Ft",
      rating: 5,
      videoThumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop"
    }
  ];

  const achievements = [
    {
      number: "1000+",
      label: "Happy Families",
      icon: Users
    },
    {
      number: "50+",
      label: "Projects Delivered",
      icon: Home
    },
    {
      number: "15+",
      label: "Years of Excellence",
      icon: Award
    },
    {
      number: "98%",
      label: "Customer Satisfaction",
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Hero Section */}
      <section className="bg-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center bg-kmk-gold/20 rounded-full px-6 py-2 text-kmk-gold mb-4">
              <Star size={20} className="mr-2" />
              Customer Stories
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Happy Clients</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the stories of families who have found their dream homes with KMK Homes. 
            Real experiences, genuine satisfaction, and lifelong relationships.
          </p>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-kmk-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-kmk-gold" />
                  </div>
                  <div className="text-4xl font-bold text-kmk-navy mb-2">{achievement.number}</div>
                  <div className="text-gray-600">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Customer Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read detailed stories from our satisfied customers who have made KMK Homes their trusted choice for luxury living.
            </p>
          </div>

          <div className="space-y-12">
            {clientStories.map((story, index) => (
              <Card key={story.id} className={`overflow-hidden border-0 shadow-xl ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex-row`}>
                <div className="lg:w-1/3">
                  <div className="relative h-64 lg:h-full">
                    <img
                      src={story.videoThumbnail}
                      alt={`${story.name} Villa`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-kmk-navy/20" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-1 text-kmk-gold" />
                        <span className="text-gray-700 font-medium">{story.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="lg:w-2/3 p-8 lg:p-12">
                  <div className="flex items-start mb-6">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover mr-6 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-kmk-navy mb-2">{story.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin size={16} className="mr-2 text-kmk-gold" />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex text-kmk-gold mb-3">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-medium mb-4">
                        {story.property}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote size={32} className="text-kmk-gold/30 absolute -top-2 -left-2" />
                    <p className="text-gray-700 leading-relaxed text-lg pl-8">
                      {story.story}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Quick testimonials from our happy homeowners</p>
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
                  
                  <div className="relative mb-4">
                    <Quote size={24} className="text-kmk-gold/30 absolute -top-2 -left-2" />
                    <p className="text-gray-700 italic leading-relaxed pl-6">"{testimonial.testimonial}"</p>
                  </div>
                  
                  <div className="flex text-kmk-gold">
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

      {/* Client Gallery */}
      <section className="py-20 bg-kmk-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Happy Moments Gallery</h2>
            <p className="text-xl text-gray-600">
              Celebrating joyful moments with our clients during key handovers and site visits
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop"
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
                <img
                  src={image}
                  alt={`Happy Client ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-kmk-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Star size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-semibold">Happy Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Join Our Family of Happy Homeowners</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the same exceptional service and quality that has made thousands of families choose KMK Homes. 
            Your dream home awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 px-8 py-4">
              <Link to="/projects">
                View Our Projects <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <Link to="/contact">Schedule a Visit</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HappyClients;