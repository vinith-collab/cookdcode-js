import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Resolve static files directory - priority to public, fallback to dist or current directory
const publicPath = fs.existsSync(path.resolve(process.cwd(), 'public', 'index.html'))
  ? path.resolve(process.cwd(), 'public')
  : fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html'))
  ? path.resolve(process.cwd(), 'dist')
  : path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not found. Please ensure public/index.html exists.');
  }
});

function startServer(port, maxAttempts = 10) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`\n  🚀 CookDcode AI Mentor Server running!`);
    console.log(`  ➜ Local:   http://localhost:${port}/`);
    console.log(`  ➜ Network: http://127.0.0.1:${port}/\n`);
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
