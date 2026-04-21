import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { email } = req.body;
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          return res.status(200).json({ message: 'Already subscribed' });
        }
        throw error;
      }
      
      return res.status(201).json({ message: 'Subscribed successfully', data });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
