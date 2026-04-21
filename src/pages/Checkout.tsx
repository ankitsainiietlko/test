import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState({
    full_name: user?.profile?.full_name || '',
    phone: user?.profile?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  if (!user) {
    navigate('/');
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/');
    return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        user_id: user?.id || null,
        total: total + 50 - (total > 999 ? 50 : 0),
        status: 'confirmed',
        shipping_address: address,
        payment_method: paymentMethod,
        tracking_id: `GV${Date.now()}`
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (orderError) {
        console.error('Order error:', orderError.message);
        throw new Error(orderError.message);
      }

      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('Order items error:', itemsError.message);
        throw new Error(itemsError.message);
      }

      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      console.error('Order error:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">Order Placed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shipping = 50;
  const discount = total > 999 ? 50 : 0;
  const finalTotal = total + shipping - discount;

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>1</div>
                <h2 className="font-bold dark:text-white">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.full_name}
                  onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                  className="col-span-2 px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="col-span-2 px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>2</div>
                <h2 className="font-bold dark:text-white">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <Truck className="w-6 h-6" />
                  <div>
                    <p className="font-medium dark:text-white">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'card' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <p className="font-medium dark:text-white">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Secure payment via Razorpay</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'upi' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs font-bold">UPI</div>
                  <div>
                    <p className="font-medium dark:text-white">UPI</p>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-fit">
            <h2 className="font-bold mb-4 dark:text-white">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.products.image_url} alt={item.products.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1 dark:text-white">{item.products.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium dark:text-white">₹{item.products.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="dark:text-white">₹{total}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span className="dark:text-white">₹{shipping}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discount}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">₹{finalTotal}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !address.full_name || !address.phone || !address.street}
              className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? 'Placing Order...' : `Place Order • ₹${finalTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
