import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Award, Minus, Plus, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [nutrition, setNutrition] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
      const filtered = viewed.filter((p: any) => p.id !== product.id);
      const newViewed = [{ id: product.id, name: product.name, price: product.price, image: product.image_url }, ...filtered].slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(newViewed));
    }
  }, [product]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productId = parseInt(id || '0');
      
      const [prodRes, allProductsRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', productId).single(),
        supabase.from('products').select('*')
      ]);

      if (prodRes.data) {
        setProduct(prodRes.data);
        
        const { data: nutritionData } = await supabase
          .from('nutrition_facts')
          .select('*')
          .eq('product_id', productId)
          .maybeSingle();
        setNutrition(nutritionData);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, profiles(full_name)')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
        setReviews(reviewsData || []);

        if (allProductsRes.data) {
          const relatedProducts = allProductsRes.data
            .filter((p: any) => p.category === prodRes.data.category && p.id !== productId)
            .slice(0, 4);
          setRelated(relatedProducts);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product.id, 1);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert('Please sign in to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await supabase.from('wishlists').delete().match({ user_id: user.id, product_id: product.id });
      } else {
        await supabase.from('wishlists').insert([{ user_id: user.id, product_id: product.id }]);
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!user) {
      alert('Please sign in to submit a review');
      return;
    }
    try {
      await supabase.from('reviews').insert([{
        user_id: user.id,
        product_id: product.id,
        rating,
        comment
      }]);
      fetchProduct();
    } catch (err) {
      console.error('Review error:', err);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-green-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/#products')} className="hover:text-green-600">Products</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
            <div
              ref={imageRef}
              className="relative aspect-square overflow-hidden rounded-xl cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={isZoomed ? { transform: 'scale(1.5)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
              />
            </div>
            {isZoomed && (
              <p className="text-center text-sm text-gray-500 mt-2">Click to zoom • Scroll to pan</p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-green-600 text-sm font-medium capitalize">{product.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 ml-1">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-green-700">₹{product.price}</span>
              {product.original_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price}</span>
                  <span className="text-red-500 font-medium">
                    {Math.round((1 - product.price / product.original_price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-xl">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-medium dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-xl">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button onClick={toggleWishlist} className={`p-3 border rounded-xl ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAddToCart} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl">
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs">Secure Payment</p>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs">Certified Organic</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex gap-8 border-b dark:border-gray-700 mb-6 overflow-x-auto">
            {['description', 'nutrition', 'howto', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {tab === 'howto' ? 'How to Use' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="text-gray-600 dark:text-gray-400">
              <p>{product.description}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">Key Benefits:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 100% Organic & Natural</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Sourced directly from farmers</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> No preservatives or additives</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Eco-friendly packaging</li>
              </ul>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="max-w-md">
              {nutrition ? (
                <div className="border-2 border-gray-900 dark:border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-gray-200 pb-2 mb-2">Nutrition Facts</h3>
                  <p className="text-sm">Serving Size: {nutrition.serving_size}</p>
                  <p className="text-sm font-bold py-1 border-b border-gray-300">Calories {nutrition.calories}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="font-medium">Total Fat</span><span>{nutrition.fat}</span></div>
                    <div className="flex justify-between"><span className="font-medium">Total Carbohydrate</span><span>{nutrition.carbs}</span></div>
                    <div className="flex justify-between pl-4"><span>Dietary Fiber</span><span>{nutrition.fiber}</span></div>
                    <div className="flex justify-between pl-4"><span>Sugars</span><span>{nutrition.sugar}</span></div>
                    <div className="flex justify-between"><span className="font-medium">Protein</span><span>{nutrition.protein}</span></div>
                  </div>
                  <div className="mt-3 pt-2 border-t text-xs text-gray-500 space-y-1">
                    <p><span className="font-medium">Sodium:</span> {nutrition.sodium}</p>
                    <p><span className="font-medium">Ingredients:</span> {nutrition.ingredients}</p>
                    <p><span className="font-medium">Allergens:</span> {nutrition.allergens}</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className="mb-4">No nutrition data available for this product.</p>
                  <div className="border-2 border-gray-900 dark:border-gray-200 rounded-lg p-4 opacity-75">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Nutrition Facts</h3>
                    <p className="text-sm mt-2">Serving Size: 100g</p>
                    <p className="text-sm font-bold py-1 border-b border-gray-300">Calories: -</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Total Fat</span><span>-</span></div>
                      <div className="flex justify-between"><span>Total Carbohydrate</span><span>-</span></div>
                      <div className="flex justify-between"><span>Protein</span><span>-</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'howto' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">How to Store</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Store in a cool, dry place away from direct sunlight</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Keep in an airtight container to maintain freshness</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Avoid exposure to moisture to prevent spoilage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">How to Use</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Perfect for snacking directly from the package</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Add to chaats, desserts, and recipes for extra crunch</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Mix with trail mixes for a healthy snack option</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Tips</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Best consumed within 3 months of opening</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-1" /> Can be stored in refrigerator for extended shelf life</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
              
              {user && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="font-medium mb-2 dark:text-white">Write a Review</p>
                  <ReviewForm onSubmit={submitReview} />
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b dark:border-gray-700 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-medium dark:text-white">{review.profiles?.full_name || 'Anonymous'}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((item) => (
                <button key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="text-left group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 mb-3">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-medium line-clamp-1 dark:text-white">{item.name}</h3>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit }: { onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(rating, comment);
    setSubmitting(false);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)}>
            <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}