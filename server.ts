import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distServerPath = path.resolve(process.cwd(), 'dist', 'server.js');

// When executing unbundled server.ts via 'node server.ts', delegate directly to pre-bundled dist/server.js if it exists
if (fs.existsSync(distServerPath) && !process.env.__INSIDE_BUNDLED_SERVER__) {
  process.env.__INSIDE_BUNDLED_SERVER__ = '1';
  const target = './dist/server.js';
  await import(target);
} else {
  const express = (await import('express')).default;
  const { app } = await import('./server/app.js');

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const distPath = fs.existsSync(path.resolve(process.cwd(), 'dist'))
    ? path.resolve(process.cwd(), 'dist')
    : path.resolve(__dirname, 'dist');

  app.use(express.static(distPath));

  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. Please run npm run build.');
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CookDcode AI Mentor Server running on http://0.0.0.0:${PORT}`);
  });
}
