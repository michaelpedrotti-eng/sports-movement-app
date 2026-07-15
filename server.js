import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runAnalysis } from './lib/analysis.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/analyze', async (req, res) => {
  try {
    const result = await runAnalysis(req.body);
    res.json(result);
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\nThe Movement AI running at http://localhost:${PORT}\n`);
});
