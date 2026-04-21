import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Login required' });

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (req.method === 'GET') {
      const { data: points } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const { data: history } = await supabase
        .from('loyalty_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      return res.status(200).json({
        points: points?.points || 0,
        tier: points?.tier || 'Bronze',
        history: history || [],
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
