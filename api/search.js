import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { q, category, min_price, max_price, sort } = req.query;
      
      let query = supabase.from('products').select('*');
      
      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      if (min_price) {
        query = query.gte('price', parseInt(min_price));
      }
      
      if (max_price) {
        query = query.lte('price', parseInt(max_price));
      }
      
      // Sort
      if (sort === 'price_low') query = query.order('price', { ascending: true });
      else if (sort === 'price_high') query = query.order('price', { ascending: false });
      else if (sort === 'rating') query = query.order('rating', { ascending: false });
      else query = query.order('id', { ascending: true });
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
