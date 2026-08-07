import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runAnalysis } from './lib/analysis.js';
import { appendCorrectionLog } from './lib/logCorrection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
// Drill Analysis sends several sampled video frames as base64 images per request — well under
// Vercel's 4.5MB platform request-size ceiling in production, but comfortably above Express's
// default 100kb JSON limit, so it needs raising here for local dev parity.
app.use(express.json({ limit: '15mb' }));
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

app.post('/api/log-correction', (req, res) => {
  appendCorrectionLog(req.body || {});
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\nThe Movement AI running at http://localhost:${PORT}\n`);
});
