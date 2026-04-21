import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const fetchBlogs = async () => {
    try {
      let query = supabase.from('blogs').select('*');
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      const { data, error } = await query;
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const categories = ['all', 'Recipes', 'Health', 'Education', 'Farmer Stories', 'How To'];

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Our Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover recipes, health tips, farmer stories, and more about organic living
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50'
              }`}
            >
              {cat === 'all' ? 'All Posts' : cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {blogs.length > 0 && activeCategory === 'all' && (
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <img
                  src={blogs[0].image_url}
                  alt={blogs[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-green-600 font-medium text-sm">{blogs[0].category}</span>
                  <h2 className="text-2xl font-bold mt-2 mb-4 dark:text-white">{blogs[0].title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{blogs[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blogs[0].read_time} min read</span>
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${blogs[0].slug}`)}
                    className="self-start flex items-center gap-2 text-green-600 font-medium hover:underline"
                  >
                    Read More <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'all' ? blogs.slice(1) : blogs).map((blog) => (
            <button
              key={blog.id}
              onClick={() => navigate(`/blog/${blog.slug}`)}
              className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-6">
                <span className="text-green-600 text-sm font-medium">{blog.category}</span>
                <h3 className="text-lg font-bold mt-2 mb-3 dark:text-white group-hover:text-green-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.read_time} min</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
