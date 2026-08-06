import fs from 'fs';
import path from 'path';
import os from 'os';

// Serverless environments (Vercel) only allow writes to the OS temp dir, and that storage is
// ephemeral (does not persist across deployments or separate function instances). Using the same
// temp-dir path in both local dev and production keeps this one code path for both — acceptable
// for this "for now" background collection use case, per the task.
const LOG_PATH = path.join(os.tmpdir(), 'movement-ai-corrections.jsonl');

export function appendCorrectionLog(entry) {
  const line = JSON.stringify({ ...entry, loggedAt: new Date().toISOString() }) + '\n';
  try {
    fs.appendFileSync(LOG_PATH, line);
  } catch (err) {
    console.error('Failed to write correction log:', err.message);
  }
}
