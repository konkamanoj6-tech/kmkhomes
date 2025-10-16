import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Eye, Tag, Search, Filter } from 'lucide-react';
import { publicApi } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';
import { generateMetaTags, generateOrganizationSchema } from '../utils/seoUtils';

const BlogListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  
  const categories = ['Luxury Villas', 'Budget Homes', 'Open Plots', 'Market Insights'];

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await publicApi.getBlogs(params);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    searchTerm === '' || 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const featuredBlogs = filteredBlogs.filter(blog => blog.featured);
  const regularBlogs = filteredBlogs.filter(blog => !blog.featured);

  const metaTags = generateMetaTags('blog');

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={metaTags.title}
        description={metaTags.description}
        keywords={metaTags.keywords}
        schema={generateOrganizationSchema()}
      />

      {/* Header */}
      <section className="bg-gradient-to-r from-kmk-navy via-gray-800 to-kmk-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">KMK Insights</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Expert insights on Hyderabad real estate, luxury villas, investment tips, and market trends
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kmk-gold focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-600 flex-shrink-0" />
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('all')}
              className={selectedCategory === 'all' ? 'bg-kmk-gold hover:bg-kmk-gold/90' : ''}
            >
              All Posts
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category)}
                className={selectedCategory === category ? 'bg-kmk-gold hover:bg-kmk-gold/90' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          <p>{filteredBlogs.length} {filteredBlogs.length === 1 ? 'Article' : 'Articles'} Found</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredBlogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-kmk-navy mb-6 flex items-center gap-2">
                  <span className="text-kmk-gold">★</span> Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredBlogs.map(blog => (
                    <BlogCard key={blog._id} blog={blog} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularBlogs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-kmk-navy mb-6">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularBlogs.map(blog => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              </div>
            )}

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found. Try adjusting your search or filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ blog, featured = false }) => {
  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-shadow duration-300 ${featured ? 'lg:flex' : ''}`}>
      <Link to={`/insights/${blog.slug}`} className="block">
        <img
          src={blog.featured_image}
          alt={blog.title}
          loading="lazy"
          className={`w-full object-cover ${featured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-48'}`}
        />
      </Link>
      <CardContent className={`p-6 ${featured ? 'lg:w-1/2' : ''}`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className="bg-kmk-gold text-white">{blog.category}</Badge>
          {blog.featured && <Badge variant="outline">Featured</Badge>}
        </div>
        
        <Link to={`/insights/${blog.slug}`}>
          <h3 className={`font-bold mb-3 hover:text-kmk-gold transition-colors ${featured ? 'text-2xl' : 'text-xl'} line-clamp-2`}>
            {blog.title}
          </h3>
        </Link>
        
        <p className={`text-gray-600 mb-4 ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {blog.excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(blog.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{blog.views || 0}</span>
          </div>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag size={10} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <Link to={`/insights/${blog.slug}`}>
          <Button variant="outline" className="w-full border-kmk-gold text-kmk-gold hover:bg-kmk-gold hover:text-white">
            Read More →
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogListing;