import { useState } from 'react';
import { Building2, Users, Package, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BulkOrder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product_type: '',
    quantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('bulk_orders').insert([formData]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 dark:text-white">Inquiry Submitted!</h1>
          <p className="text-gray-600 dark:text-gray-400">Our team will contact you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Section */}
          <div>
            <span className="text-green-600 font-medium">B2B Solutions</span>
            <h1 className="text-4xl font-bold mt-2 mb-6 dark:text-white">Bulk Orders & Corporate Gifting</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looking for bulk quantities or custom corporate gifts? We offer special pricing 
              for businesses, retailers, and organizations. From 10kg to 10 tons, we can handle it all.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Corporate Gifting</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Custom hampers for employees and clients</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Retail Partners</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Wholesale pricing for stores and distributors</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Bulk Quantities</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">From 10kg to container loads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="Company Name (optional)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Product Type</option>
                <option value="makhana">Makhana</option>
                <option value="mangoes">Mangoes</option>
                <option value="spices">Spices</option>
                <option value="grains">Grains & Pulses</option>
                <option value="dry-fruits">Dry Fruits</option>
                <option value="mixed">Mixed Products</option>
              </select>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Quantity</option>
                <option value="10-50kg">10-50 kg</option>
                <option value="50-100kg">50-100 kg</option>
                <option value="100-500kg">100-500 kg</option>
                <option value="500kg-1ton">500 kg - 1 ton</option>
                <option value="1ton+">1 ton+</option>
              </select>
              <textarea
                placeholder="Additional Requirements"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
