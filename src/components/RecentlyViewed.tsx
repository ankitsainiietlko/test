import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    setProducts(viewed.slice(0, 4));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
          <Clock className="w-5 h-5" />
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="text-left group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-medium text-sm line-clamp-1 dark:text-white">{product.name}</h3>
              <p className="text-green-600 font-bold">₹{product.price}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
