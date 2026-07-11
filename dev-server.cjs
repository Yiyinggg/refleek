// Local dev server mirroring the Vercel setup:
//   OPENROUTER_API_KEY=sk-or-... node dev-server.cjs
// Serves static files from the repo root and routes /api/generate to api/generate.js.
// Without the env var the API answers with mock images.

const http = require('http');
const fs = require('fs');
const path = require('path');
const generate = require('./api/generate.js');

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
  if (req.url.startsWith('/api/generate')) {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }
      Promise.resolve(generate(req, vercelRes(res))).catch((e) => {
        vercelRes(res).status(500).json({ error: String(e) });
      });
    });
    return;
  }
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const rel = urlPath === '/' ? '/UI/ReFleek.dc.html' : urlPath;
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log('ReFleek dev server → http://localhost:' + PORT + (process.env.OPENROUTER_API_KEY ? ' (live OpenRouter)' : ' (MOCK mode — set OPENROUTER_API_KEY for real generation)'));
});
