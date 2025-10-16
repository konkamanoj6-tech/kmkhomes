import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { publicApi } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';
import { generateBlogPostSchema } from '../utils/seoUtils';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getBlogBySlug(slug);
      setBlog(response.data);
      
      // Fetch related blogs from same category
      if (response.data.category) {
        const relatedResponse = await publicApi.getBlogs({ 
          category: response.data.category,
          limit: 3 
        });
        setRelatedBlogs(relatedResponse.data.filter(b => b._id !== response.data._id).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/insights');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={blog.meta_title || `${blog.title} | KMK Homes`}
        description={blog.meta_description || blog.excerpt}
        keywords={blog.meta_keywords || blog.tags?.join(', ')}
        ogImage={blog.featured_image}
        ogType="article"
        schema={generateBlogPostSchema(blog)}
      />

      {/* Header Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={blog.featured_image}
          alt={blog.title}
          loading="eager"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <Card className="mb-8">
          <CardContent className="p-8 md:p-12">
            {/* Back Button */}
            <Link to="/insights" className="inline-flex items-center gap-2 text-kmk-gold hover:text-kmk-gold/80 mb-6">
              <ArrowLeft size={20} />
              <span>Back to All Articles</span>
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <Badge className="bg-kmk-gold text-white text-sm px-4 py-1">
                {blog.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-kmk-navy mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(blog.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{blog.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">By {blog.author}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
              {blog.excerpt}
            </p>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                lineHeight: '1.8',
              }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Share2 size={18} />
                Share this article
              </h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2"
                >
                  <Facebook size={16} />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2"
                >
                  <Twitter size={16} />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Card */}
        <Card className="mb-8 bg-gradient-to-r from-kmk-navy to-gray-800 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Find Your Dream Home?</h3>
            <p className="text-gray-300 mb-6">
              Explore our luxury villas, budget homes, and premium plots in Hyderabad
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/projects">
                <Button className="bg-kmk-gold hover:bg-kmk-gold/90 text-white">
                  View Our Projects
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-kmk-navy">
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-kmk-navy mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map(relatedBlog => (
                <Card key={relatedBlog._id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <Link to={`/insights/${relatedBlog.slug}`}>
                    <img
                      src={relatedBlog.featured_image}
                      alt={relatedBlog.title}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <CardContent className="p-4">
                    <Badge className="bg-kmk-gold text-white mb-2">{relatedBlog.category}</Badge>
                    <Link to={`/insights/${relatedBlog.slug}`}>
                      <h3 className="font-bold mb-2 hover:text-kmk-gold transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedBlog.excerpt}</p>
                    <Link to={`/insights/${relatedBlog.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;