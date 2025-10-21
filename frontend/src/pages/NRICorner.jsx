import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, FileText, CreditCard, Phone, CheckCircle, ArrowRight, Users, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const NRICorner = () => {
  const nriServices = [
    {
      icon: FileText,
      title: "Legal Documentation Support",
      description: "Complete assistance with property registration, legal documentation, and compliance with Indian real estate laws."
    },
    {
      icon: CreditCard,
      title: "Home Loan Assistance",
      description: "Specialized NRI home loan processing with top banks offering competitive interest rates and flexible terms."
    },
    {
      icon: Shield,
      title: "Property Management",
      description: "Professional property management services including maintenance, tenant management, and rental collection."
    },
    {
      icon: Phone,
      title: "Remote Consultation",
      description: "Video consultations, virtual property tours, and dedicated NRI relationship managers for seamless communication."
    }
  ];

  const investmentBenefits = [
    {
      title: "High ROI Potential",
      description: "Properties in Hyderabad offer excellent appreciation potential with growing IT sector and infrastructure development.",
      percentage: "12-15%"
    },
    {
      title: "Rental Income",
      description: "Strong rental market with professional tenants from IT companies ensuring steady income flow.",
      percentage: "8-10%"
    },
    {
      title: "Tax Benefits", 
      description: "Avail various tax benefits under Indian income tax laws for property investments and home loans.",
      percentage: "Up to 2L"
    },
    {
      title: "Currency Advantage",
      description: "Favorable exchange rates make Indian real estate attractive for NRI investors from multiple countries.",
      percentage: "25-30%"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "Connect with our NRI specialists to understand your requirements and investment goals."
    },
    {
      step: "02", 
      title: "Property Selection",
      description: "Browse curated properties with virtual tours and detailed documentation."
    },
    {
      step: "03",
      title: "Legal Due Diligence",
      description: "Complete legal verification and documentation support with transparent processes."
    },
    {
      step: "04",
      title: "Investment & Registration",
      description: "Secure payment processing and property registration with full legal compliance."
    },
    {
      step: "05",
      title: "Handover & Management",
      description: "Property handover with optional management services for hassle-free ownership."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Patel",
      location: "Software Engineer, USA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      testimonial: "KMK Homes made my property investment from USA completely seamless. Their NRI support team handled everything professionally."
    },
    {
      name: "Priya Sharma", 
      location: "Business Analyst, Canada",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      testimonial: "Excellent service and transparency throughout the process. I could monitor everything remotely and felt completely secure."
    },
    {
      name: "David Johnson",
      location: "Consultant, Australia",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      testimonial: "The property management services are outstanding. My villa is well-maintained and generates good rental income."
    }
  ];

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Hero Section */}
      <section className="relative bg-kmk-navy text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=900&fit=crop"
            alt="Global Investment"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Globe size={32} className="text-kmk-gold mr-3" />
                <span className="text-kmk-gold font-semibold text-lg">NRI Corner</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Invest in Indian Real Estate
                <span className="block text-kmk-gold">from Anywhere</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Dedicated services for Non-Resident Indians to invest in premium villas with 
                complete legal support, transparent processes, and professional property management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90">
                  <Link to="/contact">Get NRI Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy">
                  <Link to="/projects">View Properties</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop"
                alt="NRI Investment"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NRI Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Comprehensive NRI Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end support designed specifically for Non-Resident Indians investing in Indian real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nriServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-kmk-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent size={32} className="text-kmk-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-kmk-navy mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="py-20 bg-kmk-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Why Invest in Hyderabad Real Estate?</h2>
            <p className="text-xl text-gray-600">
              Strong fundamentals and growth potential make it ideal for NRI investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentBenefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-kmk-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.percentage}
                  </div>
                  <h3 className="text-xl font-bold text-kmk-navy mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Simple Investment Process</h2>
            <p className="text-xl text-gray-600">
              Streamlined process designed for NRIs to invest remotely with confidence
            </p>
          </div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <div key={index} className="relative text-center">
                  {/* Connection Line */}
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-kmk-gold/30 -translate-y-1/2 z-0" />
                  )}
                  
                  {/* Step Content */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-kmk-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-kmk-navy mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal & Tax Information */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Legal & Tax Compliance</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Navigate Indian real estate regulations with expert guidance on FEMA compliance, 
                tax implications, and legal documentation.
              </p>
              
              <div className="space-y-4">
                {[
                  "FEMA (Foreign Exchange Management Act) compliance",
                  "Property registration and stamp duty guidance",
                  "Income tax implications and benefits",
                  "Repatriation of funds procedures",
                  "Power of Attorney documentation",
                  "NRI-specific banking and loan processes"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle size={20} className="text-kmk-gold mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="border-0 shadow-2xl">
                <CardHeader className="bg-kmk-gold text-white text-center">
                  <CardTitle className="text-2xl">Free NRI Consultation</CardTitle>
                </CardHeader>
                <CardContent className="p-8 bg-white text-gray-800">
                  <div className="text-center mb-6">
                    <p className="text-lg mb-4">
                      Get expert guidance on your investment journey with a complimentary consultation.
                    </p>
                    <div className="text-3xl font-bold text-kmk-gold mb-2">30 Minutes</div>
                    <p className="text-gray-600">One-on-one consultation</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">Investment analysis</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">Legal guidance</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">Tax planning</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">Process roadmap</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-kmk-navy hover:bg-kmk-navy/90">
                    <Link to="/contact">Book Free Consultation</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NRI Testimonials */}
      <section className="py-20 bg-kmk-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">NRI Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from NRIs who have successfully invested with KMK Homes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-kmk-navy">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Globe size={14} className="mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.testimonial}"</p>
                  <div className="flex text-kmk-gold mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Start Your Investment Journey Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of NRIs who have successfully invested in Indian real estate with KMK Homes. 
            Get started with a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 px-8 py-4">
              <Link to="/contact">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <a href={`https://wa.me/919014060147?text=Hi! I'm an NRI interested in property investment. Can you help me?`} target="_blank" rel="noopener noreferrer">
                WhatsApp Consultation
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NRICorner;