const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const DIST = path.join(__dirname, 'dist');

app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:8080',
  changeOrigin: true,
  pathRewrite: (path) => '/api' + path, // ensure backend receives /api/*
}));

app.use(express.static(DIST));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(DIST, 'index.html'));
  }
  next();
});

app.listen(8081, () => console.log('Frontend: http://127.0.0.1:8081'));
