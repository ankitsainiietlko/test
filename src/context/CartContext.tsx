import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const sessionId = localStorage.getItem('cart_session_id') || 
    Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    localStorage.setItem('cart_session_id', sessionId);
    fetchCart();
  }, [user, sessionId]);

  const fetchCart = async () => {
    try {
      let cartQuery = supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId);
      
      if (user) {
        cartQuery = supabase
          .from('cart_items')
          .select('*')
          .or(`session_id.eq.${sessionId},user_id.eq.${user.id}`);
      }

      const { data: cartItems, error: cartError } = await cartQuery;
      if (cartError) throw cartError;

      if (!cartItems || cartItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const productIds = [...new Set(cartItems.map(item => item.product_id))];
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .in('id', productIds);
      if (productsError) throw productsError;

      const productMap = new Map(products?.map(p => [p.id, p]) || []);
      const itemsWithProducts = cartItems.map(item => ({
        ...item,
        products: productMap.get(item.product_id)
      }));
      setItems(itemsWithProducts);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const cartData: any = {
        product_id: productId,
        quantity,
        session_id: sessionId,
      };
      if (user) cartData.user_id = user.id;

      const { error } = await supabase.from('cart_items').insert([cartData]);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(itemId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}