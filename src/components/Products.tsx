import { useEffect, useState } from 'react';
import { ShoppingCart, Star, Heart, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number;
  image_url: string;
  description: string;
  rating: number;
  featured: boolean;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = (product: Product) => {
    const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const filtered = viewed.filter((p: any) => p.id !== product.id);
    const newViewed = [{ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image_url 
    }, ...filtered].slice(0, 10);
    localStorage.setItem('recently_viewed', JSON.stringify(newViewed));
  };

  const categories = [
    { id: 'all', name: language === 'hi' ? 'सभी प्रोडक्ट्स' : 'All Products', icon: Sparkles },
    { id: 'makhana', name: language === 'hi' ? 'मखाना' : 'Makhana', icon: null },
    { id: 'mangoes', name: language === 'hi' ? 'आम' : 'Mangoes', icon: null },
    { id: 'spices', name: language === 'hi' ? 'मसाले' : 'Spices', icon: null },
    { id: 'grains', name: language === 'hi' ? 'अनाज' : 'Grains', icon: null },
    { id: 'dry-fruits', name: language === 'hi' ? 'सूखे मेवे' : 'Dry Fruits', icon: null },
  ];

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            {language === 'hi' ? 'प्रीमियम सेलेक्शन' : 'Premium Selection'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-amber-600 bg-clip-text text-transparent">
              {language === 'hi' ? 'हमारे बेस्टसेलर' : 'Our Bestsellers'}
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {language === 'hi' 
              ? 'भारतीय खेतों से सीधे प्राप्त हाथ से चुने गए जैविक उत्पाद, आपके दरवाजे तक ताज़ा पहुंचाए जाते हैं।' 
              : 'Handpicked organic products sourced directly from Indian farms, delivered fresh to your doorstep'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {cat.icon && <cat.icon className="w-4 h-4" />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-600 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button
                      onClick={() => {
                        addToRecentlyViewed(product);
                        navigate(`/product/${product.id}`);
                      }}
                      className="p-3 bg-white rounded-full text-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="p-3 bg-white rounded-full text-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="p-3 bg-white rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 text-xs font-bold rounded-full shadow-lg">
                        FEATURED
                      </span>
                    )}
                    {product.original_price > product.price && (
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Indicator */}
                  {product.stock < 20 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg text-center">
                        Only {product.stock} left in stock!
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => {
                      addToRecentlyViewed(product);
                      navigate(`/product/${product.id}`);
                    }}
                    className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-green-600 transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                      {product.original_price > product.price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">₹{product.original_price}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/50 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/products')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 font-bold rounded-2xl border-2 border-green-600 shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-1"
          >
            {language === 'hi' ? 'सभी प्रोडक्ट्स देखें' : 'View All Products'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
