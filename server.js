import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Resolve static files directory - priority to public, fallback to dist or current directory
const publicPath = fs.existsSync(path.resolve(process.cwd(), 'public', 'index.html'))
  ? path.resolve(process.cwd(), 'public')
  : fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html'))
  ? path.resolve(process.cwd(), 'dist')
  : path.resolve(__dirname, 'public');

// Redirect root / to New User Landing Page (login/signup entry)
app.get('/', (req, res) => {
  res.redirect('/html/newuser.html');
});

app.use(express.static(publicPath));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/images', express.static(path.join(__dirname, 'Images')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/html') || req.path.startsWith('/css') || req.path.startsWith('/Images') || req.path.startsWith('/images')) {
    return next();
  }
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.redirect('/html/newuser.html');
  }
});

function startServer(port, maxAttempts = 10) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`\n  🚀 CookDcode AI Mentor Server running!`);
    console.log(`  ➜ Local:     http://localhost:${port}/`);
    console.log(`  ➜ Landing:   http://localhost:${port}/html/newuser.html`);
    console.log(`  ➜ Dashboard: http://localhost:${port}/html/ctc.html\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
      console.warn(`  ⚠️ Port ${port} is in use. Automatically trying port ${port + 1}...`);
      startServer(port + 1, maxAttempts - 1);
    } else {
      console.error('Server startup error:', err);
    }
  });
}

startServer(PORT);
