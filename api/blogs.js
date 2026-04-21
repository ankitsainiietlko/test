import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, category, limit } = req.query;
      
      let query = supabase.from('blogs').select('*');
      
      if (slug) {
        const { data, error } = await query.eq('slug', slug).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      
      if (category) query = query.eq('category', category);
      if (limit) query = query.limit(parseInt(limit));
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
