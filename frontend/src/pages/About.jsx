import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Award, Target, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const About = () => {
  const values = [
    {
      icon: CheckCircle,
      title: "Quality Construction",
      description: "We use premium materials and follow international construction standards to ensure lasting quality."
    },
    {
      icon: Users,
      title: "Customer Centric",
      description: "Our customers are at the heart of everything we do, ensuring complete satisfaction at every step."
    },
    {
      icon: Award,
      title: "Innovation & Design",
      description: "We combine modern architecture with innovative design to create homes that stand the test of time."
    },
    {
      icon: Target,
      title: "Timely Delivery",
      description: "We are committed to delivering projects on time without compromising on quality or specifications."
    }
  ];

  const milestones = [
    { year: "2009", title: "Company Founded", description: "Started with a vision to create premium homes" },
    { year: "2012", title: "First Project Completed", description: "Successfully delivered our first luxury villa project" },
    { year: "2018", title: "100+ Projects Milestone", description: "Completed over 50 premium villa projects across Hyderabad" },
    { year: "2024", title: "Industry Recognition", description: "Awarded 'Best Real Estate Developer' in Hyderabad" }
  ];

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Hero Section */}
      <section className="relative bg-kmk-navy text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-kmk-navy/90 to-kmk-navy/70" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">About KMK Homes</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Building dream homes for over 21 years with exceptional quality, innovative design, 
                and unwavering commitment to customer satisfaction. Your trusted partner in luxury real estate.
              </p>
              <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                alt="KMK Homes Office"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
                alt="Construction Process"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-kmk-navy mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2009, KMK Homes began with a simple yet powerful vision — to create premium residential spaces that families would be proud to call home.
                </p>
                <p>
                  We started our journey by building high-quality apartment projects, successfully delivering 60+ apartments across Hyderabad. With a strong foundation in trust and craftsmanship, we later expanded into constructing ultra-luxury triplex villas, completing 20+ premium villa projects in some of the city's most sought-after locations.
                </p>
                <p>
                  Over the years, our commitment to quality, innovation, and customer satisfaction has earned us the trust of over 1000 happy families.
                </p>
                <p>
                  Today, KMK Homes continues to set new benchmarks in luxury living — combining modern architecture, custom designs, and world-class amenities to create homes that truly exceed expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and help us deliver exceptional homes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-kmk-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent size={32} className="text-kmk-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-kmk-navy mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Removed Our Journey section as requested */}

      {/* Removed Leadership Team section as requested */}

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your Dream Home?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the KMK Homes difference. Let us help you create a home that reflects your lifestyle and dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 px-8 py-4">
              <Link to="/projects">
                View Our Projects <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;