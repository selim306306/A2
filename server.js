const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (pathname === '/health') return send(res, 200, 'application/json; charset=utf-8', JSON.stringify({ ok: true }));

  const requested = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(requested).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(root, safePath);
  const isAsset = path.extname(filePath) && fs.existsSync(filePath);

  if (isAsset) {
    const ext = path.extname(filePath);
    return send(res, 200, mime[ext] || 'application/octet-stream', fs.readFileSync(filePath));
  }

  if (pathname.startsWith('/api/')) return send(res, 404, 'application/json; charset=utf-8', JSON.stringify({ error: 'not_implemented' }));
  return send(res, 200, mime['.html'], fs.readFileSync(path.join(root, 'index.html')));
});

server.listen(port, '0.0.0.0', () => console.log(`Amin Library listening on 0.0.0.0:${port}`));
