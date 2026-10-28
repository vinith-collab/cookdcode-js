import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(rootDir, '.env') });

import { app } from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const frontendDir = path.resolve(rootDir, 'frontend');

// Resolve static files directory - priority to frontend/public, fallback to dist or frontend
const publicPath = fs.existsSync(path.resolve(frontendDir, 'public', 'index.html'))
  ? path.resolve(frontendDir, 'public')
  : fs.existsSync(path.resolve(rootDir, 'dist', 'index.html'))
  ? path.resolve(rootDir, 'dist')
  : frontendDir;

// Redirect root / to New User Landing Page (login/signup entry)
app.get('/', (req, res) => {
  res.redirect('/html/newuser.html');
});

// Serve frontend static folders
app.use(express.static(publicPath));
app.use('/html', express.static(path.join(frontendDir, 'html')));
app.use('/css', express.static(path.join(frontendDir, 'css')));
app.use('/Images', express.static(path.join(frontendDir, 'Images')));
app.use('/images', express.static(path.join(frontendDir, 'Images')));
app.use('/public', express.static(path.join(frontendDir, 'public')));
app.use('/frontend', express.static(frontendDir));

app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/html') ||
    req.path.startsWith('/css') ||
    req.path.startsWith('/Images') ||
    req.path.startsWith('/images') ||
    req.path.startsWith('/public') ||
    req.path.startsWith('/frontend')
  ) {
    return next();
  }
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.redirect('/html/newuser.html');
  }
});

function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`\n  🚀 CookDcode AI Mentor Server running!`);
    console.log(`  ➜ Local:     http://localhost:${port}/`);
    console.log(`  ➜ Landing:   http://localhost:${port}/html/newuser.html`);
    console.log(`  ➜ Dashboard: http://localhost:${port}/html/ctc.html\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n  ❌ Port ${port} is already in use!`);
      console.error(`  Fix: Kill the process using port ${port} and restart the server.`);
      console.error(`  Run: netstat -ano | findstr :${port}  (to find the PID)`);
      process.exit(1);
    } else {
      console.error('Server startup error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
