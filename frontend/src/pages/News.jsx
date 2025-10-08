import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, User, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicApi } from '../services/api';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const response = await publicApi.getNewsEvents({ limit: 20 });
      setNewsEvents(response.data);
    } catch (error) {
      console.error('Error fetching news events:', error);
    } finally {
      setLoading(false);
    }
  };

  const allNews = [
    ...newsEvents,
    {
      id: 4,
      title: "KMK Homes Introduces Smart Home Technology in All New Villas",
      date: "December 1, 2024",
      category: "Technology",
      author: "Priya Sharma",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=350&fit=crop",
      excerpt: "Revolutionary smart home integration featuring IoT devices, automated lighting, climate control, and security systems in all upcoming villa projects.",
      content: "KMK Homes is proud to announce the integration of cutting-edge smart home technology across all new villa projects..."
    },
    {
      id: 5,
      title: "Groundbreaking Ceremony for New Eco-Friendly Villa Project",
      date: "November 25, 2024",
      category: "Projects",
      author: "Rajesh Kumar",
      readTime: "3 min read", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=350&fit=crop",
      excerpt: "Launching our most sustainable project yet with 100% renewable energy, rainwater harvesting, and green building certification.",
      content: "In a significant milestone for sustainable construction, KMK Homes broke ground on our newest eco-friendly villa project..."
    },
    {
      id: 6,
      title: "Partnership with Leading Banks for Attractive Home Loan Schemes",
      date: "November 20, 2024", 
      category: "Finance",
      author: "Amit Patel",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=350&fit=crop",
      excerpt: "Exclusive home loan offers with reduced interest rates and flexible payment options for KMK Homes customers.",
      content: "KMK Homes has partnered with leading financial institutions to provide attractive home loan schemes..."
    },
    {
      id: 7,
      title: "Virtual Reality Site Tours Now Available for All Projects", 
      date: "November 15, 2024",
      category: "Technology", 
      author: "Deepika Singh",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=350&fit=crop",
      excerpt: "Experience our villas from anywhere in the world with immersive VR technology and 360-degree virtual tours.",
      content: "KMK Homes introduces state-of-the-art virtual reality tours allowing potential buyers to experience properties remotely..."
    },
    {
      id: 8,
      title: "Awards Recognition: 'Best Luxury Developer' at Realty Awards 2024",
      date: "November 10, 2024",
      category: "Awards", 
      author: "Media Team",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=350&fit=crop",
      excerpt: "KMK Homes honored with prestigious 'Best Luxury Developer' award recognizing excellence in design and customer satisfaction.",
      content: "We are thrilled to announce that KMK Homes has been awarded the prestigious 'Best Luxury Developer' title..."
    }
  ];

  const categories = ['All', 'Projects', 'Technology', 'Awards', 'Finance', 'Sustainability'];

  const filteredNews = selectedCategory === 'All' 
    ? allNews 
    : allNews.filter(news => news.category === selectedCategory);

  const featuredNews = allNews[0];
  const recentNews = allNews.slice(1, 4);

  return (
    <div className="min-h-screen bg-kmk-background">
      {/* Hero Section */}
      <section className="bg-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, project launches, achievements, and events from KMK Homes. 
            Discover what's new in luxury real estate.
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-kmk-navy mb-8">Featured News</h2>
          
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-kmk-gold hover:bg-kmk-gold/90">Featured</Badge>
                </div>
              </div>
              
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar size={16} className="mr-2 text-kmk-gold" />
                  <span className="mr-4">{featuredNews.date}</span>
                  {featuredNews.category && (
                    <>
                      <Tag size={16} className="mr-2 text-kmk-gold" />
                      <span>{featuredNews.category}</span>
                    </>
                  )}
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-kmk-navy mb-4 leading-tight">
                  {featuredNews.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {featuredNews.excerpt}
                </p>
                
                <Button className="bg-kmk-gold hover:bg-kmk-gold/90 w-fit">
                  Read Full Article <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category 
                  ? "bg-kmk-navy hover:bg-kmk-navy/90" 
                  : "border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-kmk-navy">
              {selectedCategory === 'All' ? 'Latest News' : `${selectedCategory} News`}
            </h2>
            <span className="text-gray-600">{filteredNews.length} articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <Card key={news.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                <div className="relative overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {news.category && (
                    <Badge className="absolute top-3 left-3 bg-kmk-gold hover:bg-kmk-gold/90">
                      {news.category}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center text-xs text-gray-600 mb-3">
                    <Calendar size={14} className="mr-2 text-kmk-gold" />
                    <span className="mr-4">{news.date}</span>
                    {news.readTime && (
                      <>
                        <Clock size={14} className="mr-2 text-kmk-gold" />
                        <span>{news.readTime}</span>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-kmk-navy mb-3 line-clamp-2 group-hover:text-kmk-gold transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  
                  {news.author && (
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <User size={14} className="mr-2" />
                      <span>By {news.author}</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-kmk-navy text-kmk-navy hover:bg-kmk-navy hover:text-white"
                  >
                    Read More <ArrowRight size={14} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-kmk-navy mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter and never miss important updates about new projects, 
            exclusive offers, and company news.
          </p>
          
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
                />
                <Button className="bg-kmk-gold hover:bg-kmk-gold/90 px-8">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-kmk-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kmk-navy mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">
              Join us at our upcoming events and project launches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "New Project Launch - Eco Villa Series",
                date: "January 15, 2025",
                time: "10:00 AM - 4:00 PM",
                location: "KMK Homes Experience Center",
                description: "Join us for the launch of our most sustainable villa project with special preview and early booking offers."
              },
              {
                title: "Home Buyers Seminar - Investment Guidance",
                date: "January 22, 2025", 
                time: "2:00 PM - 5:00 PM",
                location: "Hyatt Regency, Hyderabad",
                description: "Expert guidance on real estate investment, home loan processes, and market trends for potential buyers."
              },
              {
                title: "NRI Property Investment Workshop",
                date: "February 5, 2025",
                time: "11:00 AM - 3:00 PM", 
                location: "Virtual Event",
                description: "Special online session for NRIs covering investment opportunities, legal processes, and documentation."
              }
            ].map((event, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2 text-kmk-gold" />
                    <span className="mr-4">{event.date}</span>
                    <Clock size={16} className="mr-2 text-kmk-gold" />
                    <span>{event.time}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <h3 className="text-xl font-bold text-kmk-navy mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>📍 {event.location}</span>
                  </div>
                  <Button variant="outline" className="w-full border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white">
                    Register Now <ExternalLink size={14} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-kmk-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Explore Our Projects?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Stay informed about our latest developments and be the first to know about new project launches and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-kmk-gold hover:bg-kmk-gold/90 px-8 py-4">
              <Link to="/projects">
                View Projects <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-kmk-navy px-8 py-4">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;