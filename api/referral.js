import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Login required' });

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (req.method === 'GET') {
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      return res.status(200).json({
        code: profile?.referral_code || '',
        referrals: referrals || [],
        totalEarned: referrals?.reduce((sum, r) => sum + (r.reward || 0), 0) || 0,
      });
    }

    if (req.method === 'POST') {
      const { code } = req.body;
      
      // Find referrer
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', code)
        .single();
      
      if (!referrer) return res.status(404).json({ error: 'Invalid code' });
      if (referrer.id === user.id) return res.status(400).json({ error: 'Cannot use own code' });
      
      // Create referral record
      await supabase.from('referrals').insert({
        referrer_id: referrer.id,
        referred_id: user.id,
        code,
        reward: 100,
      });
      
      // Add loyalty points
      await supabase.rpc('add_loyalty_points', {
        user_id: user.id,
        points: 50,
      });
      
      return res.status(200).json({ message: 'Referral applied successfully' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
