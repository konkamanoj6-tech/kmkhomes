import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { adminApi } from '../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'Luxury Villas',
    author: 'KMK Homes Team',
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    featured: false,
    active: true
  });
  const [tagInput, setTagInput] = useState('');

  const categories = ['Luxury Villas', 'Budget Homes', 'Open Plots', 'Market Insights'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await adminApi.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      if (editingBlog) {
        await adminApi.updateBlog(editingBlog._id, blogData);
      } else {
        await adminApi.createBlog(blogData);
      }

      await fetchBlogs();
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog. Please try again.');
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminApi.deleteBlog(blogId);
        await fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image: blog.featured_image,
      category: blog.category,
      author: blog.author || 'KMK Homes Team',
      tags: blog.tags || [],
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      featured: blog.featured || false,
      active: blog.active !== undefined ? blog.active : true
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: 'Luxury Villas',
      author: 'KMK Homes Team',
      tags: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      featured: false,
      active: true
    });
    setEditingBlog(null);
    setShowForm(false);
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KMK Insights (Blog)</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts and insights</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Blog Post'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="auto-generated from title"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Excerpt *</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Short description for preview (150-200 characters)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Content (HTML supported) *</label>
                  <textarea
                    required
                    rows={10}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Full blog content. You can use HTML tags like <h2>, <p>, <ul>, <li>, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Featured Image URL *</label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags/Keywords</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-md"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tag and press Enter"
                    />
                    <Button type="button" onClick={addTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">SEO Settings (Optional - Auto-generated if empty)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">SEO Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      placeholder="Will default to: Title | KMK Homes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      placeholder="Will default to excerpt (max 160 characters)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span className="text-sm">Featured Post</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  />
                  <span className="text-sm">Active/Published</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} className="overflow-hidden">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={blog.active ? "default" : "secondary"}>
                  {blog.active ? 'Published' : 'Draft'}
                </Badge>
                {blog.featured && <Badge variant="outline">Featured</Badge>}
                <Badge variant="outline">{blog.category}</Badge>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar size={14} />
                <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
                <span>•</span>
                <Eye size={14} />
                <span>{blog.views || 0} views</span>
              </div>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(blog._id)}>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No blog posts yet. Click "Add Blog Post" to create your first post!</p>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
