import { runAnalysis } from '../lib/analysis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await runAnalysis(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
}
