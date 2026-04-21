import { useEffect, useState } from 'react';
import { Search, Filter, X, ShoppingCart, Heart, Grid, List, Star, Loader2, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
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

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const categories = [
    { id: 'all', name: language === 'hi' ? 'सभी' : 'All' },
    { id: 'makhana', name: language === 'hi' ? 'मखाना' : 'Makhana' },
    { id: 'mangoes', name: language === 'hi' ? 'आम' : 'Mangoes' },
    { id: 'spices', name: language === 'hi' ? 'मसाले' : 'Spices' },
    { id: 'grains', name: language === 'hi' ? 'अनाज' : 'Grains' },
    { id: 'dry-fruits', name: language === 'hi' ? 'सूखे मेवे' : 'Dry Fruits' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, priceRange, selectedRating, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedRating > 0) {
      result = result.filter(p => p.rating >= selectedRating);
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(result);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 2000]);
    setSelectedRating(0);
    setInStockOnly(false);
    setSortBy('default');
  };

  const handleAddToCart = (product: Product) => {
    addToCart({ product_id: product.id, quantity: 1, price: product.price, products: product });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            {language === 'hi' ? 'सभी प्रोडक्ट्स' : 'All Products'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} {language === 'hi' ? 'प्रोडक्ट्स मिले' : 'products found'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'प्रोडक्ट खोजें...' : 'Search products...'}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-700 dark:text-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl dark:text-white"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {language === 'hi' ? 'फ़िल्टर' : 'Filters'}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-700 dark:text-white"
            >
              <option value="default">{language === 'hi' ? 'डिफ़ॉल्ट' : 'Default'}</option>
              <option value="price-low">{language === 'hi' ? 'कम कीमत' : 'Price: Low to High'}</option>
              <option value="price-high">{language === 'hi' ? 'उच्च कीमत' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'hi' ? 'रेटिंग' : 'Rating'}</option>
              <option value="name">{language === 'hi' ? 'नाम' : 'Name'}</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'dark:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'dark:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-2">
                    {language === 'hi' ? 'श्रेणी' : 'Category'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedCategory === cat.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-2">
                    {language === 'hi' ? 'कीमत सीमा' : 'Price Range'}: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 px-2 py-1 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 px-2 py-1 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-2">
                    {language === 'hi' ? 'रेटिंग' : 'Rating'}
                  </label>
                  <div className="flex gap-1">
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          selectedRating === rating ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                        }`}
                      >
                        {rating}+ <Star className="w-3 h-3 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock & Clear */}
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-2">
                    {language === 'hi' ? 'उपलब्धता' : 'Availability'}
                  </label>
                  <label className="flex items-center gap-2 dark:text-white mb-3">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4"
                    />
                    {language === 'hi' ? 'सिर्फ स्टॉक में' : 'In Stock Only'}
                  </label>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {language === 'hi' ? 'सभी फ़िल्टर हटाएं' : 'Clear All Filters'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {language === 'hi' ? 'कोई प्रोडक्ट नहीं मिला' : 'No products found'}
            </p>
            <button onClick={clearFilters} className="mt-4 text-green-600 hover:underline">
              {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div 
                  className="aspect-square relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.original_price > product.price && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-green-600 font-medium uppercase">{product.category}</p>
                  <h3 
                    className="font-semibold dark:text-white cursor-pointer hover:text-green-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm ml-1 dark:text-gray-300">{product.rating}</span>
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500">Out of Stock</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold dark:text-white">₹{product.price}</span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex gap-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div 
                  className="w-40 h-40 rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-green-600 font-medium uppercase">{product.category}</p>
                  <h3 
                    className="text-lg font-semibold dark:text-white cursor-pointer hover:text-green-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm ml-1 dark:text-gray-300">{product.rating}</span>
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500">Out of Stock</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold dark:text-white">₹{product.price}</span>
                      {product.original_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
