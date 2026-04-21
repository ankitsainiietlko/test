import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      setBlog(data);
    } catch (err) {
      console.error('Fetch error:', err);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !blog) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-green-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/blogs')} className="hover:text-green-600">Blogs</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">{blog.title}</span>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">{blog.category}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.read_time} min read</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(blog.created_at).toLocaleDateString()}</span>
            </div>

            <h1 className="text-3xl font-bold mb-6 dark:text-white">{blog.title}</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{blog.excerpt}</p>
              <p className="text-gray-600 dark:text-gray-400">{blog.content}</p>
            </div>

            <div className="mt-8 pt-8 border-t dark:border-gray-700">
              <button 
                onClick={() => navigate('/blogs')}
                className="text-green-600 font-medium hover:underline"
              >
                ← Back to Blogs
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}