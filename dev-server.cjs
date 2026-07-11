// Local dev server mirroring the Vercel setup:
//   OPENROUTER_API_KEY=... node dev-server.cjs
//   OPEN_AI_API=... node dev-server.cjs
// Serves static files from the repo root and routes /api/generate + /api/preview.
// Without the env var the API answers with mock images.

const http = require('http');
const fs = require('fs');
const path = require('path');
const generate = require('./api/generate.js');
const preview = require('./api/preview.js');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if (!match) {
      continue;
    }
    const key = match[1];
    let value = match[2] || '';
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, '.env.local'));

function hasApiKey() {
  return Boolean(
    process.env.OPENROUTER_API_KEY ||
      process.env.OPEN_AI_API ||
      process.env.OPENAI_API_KEY,
  );
}

const PORT = process.env.PORT || 3939;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.md': 'text/markdown', '.xml': 'application/xml',
};

function vercelRes(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res; };
  return res;
}

http.createServer((req, res) => {
  const apiRoute = req.url.startsWith('/api/preview') ? preview
    : req.url.startsWith('/api/generate') ? generate
    : null;
  if (apiRoute) {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }
      Promise.resolve(apiRoute(req, vercelRes(res))).catch((e) => {
        vercelRes(res).status(500).json({ error: String(e) });
      });
    });
    return;
  }
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const resolvedPath =
    urlPath === '/' || urlPath === ''
      ? 'index.html'
      : urlPath.startsWith('/')
        ? urlPath.slice(1)
        : urlPath;
  const file = path.join(ROOT, resolvedPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(
    'ReFleek dev server → http://localhost:' +
      PORT +
      (hasApiKey()
        ? ' (live OpenRouter)'
        : ' (MOCK mode — set OPENROUTER_API_KEY or OPEN_AI_API for real generation)'),
  );
});
