import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function saveTeamPhotoPlugin(): Plugin {
  return {
    name: 'save-team-photo-plugin',
    configureServer(server) {
      const uploadsDir = path.resolve(__dirname, 'public/uploads');
      const mediaIndexPath = path.join(uploadsDir, 'media-index.json');
      const siteImagesPath = path.join(uploadsDir, 'site-images.json');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Intercept /uploads/ requests directly
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0] || '';
        if (urlPath.startsWith('/uploads/')) {
          const fileName = decodeURIComponent(urlPath.replace('/uploads/', ''));
          const filePath = path.join(uploadsDir, fileName);
          if (fs.existsSync(filePath)) {
            const ext = path.extname(fileName).toLowerCase();
            const mimeMap: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
            };
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return fs.createReadStream(filePath).pipe(res);
          }
        }
        next();
      });

      // API: media list
      server.middlewares.use('/api/media/list', (_req, res) => {
        try {
          let items = [];
          if (fs.existsSync(mediaIndexPath)) {
            const raw = fs.readFileSync(mediaIndexPath, 'utf-8');
            items = JSON.parse(raw);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ items }));
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message, items: [] }));
        }
      });

      // API: media upload
      server.middlewares.use('/api/media/upload', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              const { dataUrl, filename, title, alt } = body;
              if (!dataUrl || !dataUrl.startsWith('data:image/')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Image invalide' }));
              }

              // Parse base64
              const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              if (!matches || matches.length !== 3) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Base64 invalide' }));
              }

              const mimeType = matches[1];
              const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
              const cleanBaseName = (filename || 'image')
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9_-]/g, '_')
                .slice(0, 40);
              const uniqueFileName = `${cleanBaseName}-${Date.now()}.${ext}`;
              const targetPath = path.join(uploadsDir, uniqueFileName);

              const buffer = Buffer.from(matches[2], 'base64');
              fs.writeFileSync(targetPath, buffer);

              // Update dist if exists
              const distUploads = path.resolve(__dirname, 'dist/uploads');
              if (fs.existsSync(distUploads)) {
                try {
                  fs.writeFileSync(path.join(distUploads, uniqueFileName), buffer);
                } catch {
                  // ignore
                }
              }

              // Calculate file size in human readable format
              const sizeInKb = Math.round(buffer.length / 1024);
              const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} Mo` : `${sizeInKb} Ko`;

              const mediaItem = {
                id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                filename: uniqueFileName,
                url: `/uploads/${uniqueFileName}`,
                title: title || cleanBaseName.replace(/[_-]/g, ' '),
                alt: alt || '',
                size: sizeStr,
                mimeType,
                uploadedAt: new Date().toISOString(),
              };

              let currentItems = [];
              if (fs.existsSync(mediaIndexPath)) {
                try {
                  currentItems = JSON.parse(fs.readFileSync(mediaIndexPath, 'utf-8'));
                } catch {
                  currentItems = [];
                }
              }
              currentItems.unshift(mediaItem);
              fs.writeFileSync(mediaIndexPath, JSON.stringify(currentItems, null, 2));

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, item: mediaItem }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Méthode non autorisée' }));
        }
      });

      // API: media delete
      server.middlewares.use('/api/media/delete', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
          req.on('end', () => {
            try {
              const { id, filename } = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              if (filename) {
                const targetPath = path.join(uploadsDir, filename);
                if (fs.existsSync(targetPath)) {
                  fs.unlinkSync(targetPath);
                }
              }
              if (fs.existsSync(mediaIndexPath)) {
                const items = JSON.parse(fs.readFileSync(mediaIndexPath, 'utf-8'));
                const filtered = items.filter((it: any) => it.id !== id && it.filename !== filename);
                fs.writeFileSync(mediaIndexPath, JSON.stringify(filtered, null, 2));
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Méthode non autorisée' }));
        }
      });

      // API: site images mapping
      server.middlewares.use('/api/site-images/get', (_req, res) => {
        try {
          let mapping = {};
          if (fs.existsSync(siteImagesPath)) {
            mapping = JSON.parse(fs.readFileSync(siteImagesPath, 'utf-8'));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ mapping }));
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message, mapping: {} }));
        }
      });

      server.middlewares.use('/api/site-images/save', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
          req.on('end', () => {
            try {
              const { mapping } = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              fs.writeFileSync(siteImagesPath, JSON.stringify(mapping || {}, null, 2));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Méthode non autorisée' }));
        }
      });

      server.middlewares.use('/api/team-photo-status', (_req, res) => {
        const publicFile = path.resolve(__dirname, 'public/IMG_8297.jpeg');
        const exists = fs.existsSync(publicFile);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ exists, url: exists ? '/IMG_8297.jpeg' : null }));
      });

      // Intercept direct request for /IMG_8297.jpeg to ensure it is always served
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0];
        if (urlPath === '/IMG_8297.jpeg' || urlPath === '/IMG_8297.jpg') {
          const publicFile = path.resolve(__dirname, 'public/IMG_8297.jpeg');
          const rootFile = path.resolve(__dirname, 'IMG_8297.jpeg');
          const srcFile = path.resolve(__dirname, 'src/IMG_8297.jpeg');

          if (fs.existsSync(publicFile)) {
            res.setHeader('Content-Type', 'image/jpeg');
            return fs.createReadStream(publicFile).pipe(res);
          } else if (fs.existsSync(rootFile)) {
            fs.copyFileSync(rootFile, publicFile);
            res.setHeader('Content-Type', 'image/jpeg');
            return fs.createReadStream(publicFile).pipe(res);
          } else if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, publicFile);
            res.setHeader('Content-Type', 'image/jpeg');
            return fs.createReadStream(publicFile).pipe(res);
          }
        }
        next();
      });

      server.middlewares.use('/api/save-team-photo', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          });
          req.on('end', () => {
            try {
              const bodyStr = Buffer.concat(chunks).toString('utf-8');
              const { dataUrl } = JSON.parse(bodyStr);
              if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const targetPublic = path.resolve(__dirname, 'public/IMG_8297.jpeg');
                const targetAlt = path.resolve(__dirname, 'public/team-photo.jpeg');
                fs.writeFileSync(targetPublic, buffer);
                fs.writeFileSync(targetAlt, buffer);

                const distDir = path.resolve(__dirname, 'dist');
                if (fs.existsSync(distDir)) {
                  try {
                    fs.writeFileSync(path.resolve(distDir, 'IMG_8297.jpeg'), buffer);
                    fs.writeFileSync(path.resolve(distDir, 'team-photo.jpeg'), buffer);
                  } catch {
                    // ignore
                  }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url: '/IMG_8297.jpeg' }));
                return;
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Format image invalide' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Erreur serveur' }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Méthode non autorisée' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveTeamPhotoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
