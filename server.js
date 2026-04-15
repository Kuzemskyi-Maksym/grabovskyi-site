const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'text/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico':  'image/x-icon',
    '.svg':  'image/svg+xml',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);

    // Якщо немає розширення — повертаємо index.html (SPA fallback)
    if (!ext) filePath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 404 — повертаємо index.html
            fs.readFile(path.join(__dirname, 'public', 'index.html'), (e, d) => {
                res.writeHead(e ? 500 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(e ? 'Server error' : d);
            });
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`✅ Сервер запущено: http://localhost:${PORT}`);
});