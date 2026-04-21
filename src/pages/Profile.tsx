import { useState, useEffect } from 'react';
import { User, MapPin, Heart, Package, Gift, Crown, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loyalty, setLoyalty] = useState({ points: 0, tier: 'Bronze', history: [] });
  const [referral, setReferral] = useState({ code: '', referrals: [], totalEarned: 0 });
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: {} });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    setProfile({
      full_name: user.profile?.full_name || '',
      phone: user.profile?.phone || '',
      address: user.profile?.address || {},
    });
    fetchLoyalty();
    fetchReferral();
  }, [user]);

  const fetchLoyalty = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      setLoyalty(data || { points: 0, tier: 'Bronze', history: [] });
    } catch (err) {
      console.error('Fetch error:', err);
      setLoyalty({ points: 0, tier: 'Bronze', history: [] });
    }
  };

  const fetchReferral = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*, profiles(*)')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      setReferral(data || { code: '', referrals: [], totalEarned: 0 });
    } catch (err) {
      console.error('Fetch error:', err);
      setReferral({ code: '', referrals: [], totalEarned: 0 });
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      setEditing(false);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'loyalty', label: 'Loyalty', icon: Crown },
    { id: 'referral', label: 'Referral', icon: Gift },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'text-amber-500';
      case 'Silver': return 'text-gray-400';
      default: return 'text-amber-700';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-bold text-lg dark:text-white">{profile.full_name || 'User'}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${activeTab === tab.id ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-l-4 border-green-600' : 'dark:text-white'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-6 py-4 text-left text-red-500 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold dark:text-white">Personal Information</h2>
                  <button
                    onClick={() => editing ? saveProfile() : setEditing(true)}
                    className="flex items-center gap-2 text-green-600"
                  >
                    {editing ? <><Check className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit</>}
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="font-medium dark:text-white">{profile.full_name || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <p className="font-medium dark:text-white">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="font-medium dark:text-white">{profile.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Your Points</p>
                      <p className="text-5xl font-bold">{loyalty.points}</p>
                    </div>
                    <div className="text-right">
                      <Crown className={`w-12 h-12 ${getTierColor(loyalty.tier)}`} />
                      <p className={`text-xl font-bold ${getTierColor(loyalty.tier)}`}>{loyalty.tier} Member</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 dark:text-white">Points History</h3>
                  {loyalty.history.length === 0 ? (
                    <p className="text-gray-500">No points earned yet</p>
                  ) : (
                    <div className="space-y-3">
                      {loyalty.history.map((h: any, i: number) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                          <p className="dark:text-white">{h.description}</p>
                          <span className={`font-medium ${h.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {h.points > 0 ? '+' : ''}{h.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'referral' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 dark:text-white">Refer & Earn</h2>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Share your code with friends and earn 100 points for each signup!</p>
                  <div className="flex items-center gap-4">
                    <code className="flex-1 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl font-mono text-lg dark:text-white">{referral.code || 'Loading...'}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(referral.code)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold dark:text-white">Total Earned</h3>
                  <p className="text-2xl font-bold text-green-600">₹{referral.totalEarned}</p>
                </div>
                <p className="text-gray-500">{referral.referrals.length} friends joined</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <button
                  onClick={() => navigate('/orders')}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium"
                >
                  View All Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
