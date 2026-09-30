import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/authRoutes.js';
import { coreRouter } from './server/routes/coreRoutes.js';
import { milestone1Router } from './server/routes/milestone1Routes.js';
import { milestone2Router } from './server/routes/milestone2Routes.js';
import { milestone3Router } from './server/routes/milestone3Routes.js';
import { demoRouter } from './server/routes/demoRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger for API debugging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'FinCore Digital Banking Platform' });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/core', coreRouter);
  app.use('/api', coreRouter);
  app.use('/api/milestone1', milestone1Router);
  app.use('/api', milestone1Router);
  app.use('/api/milestone2', milestone2Router);
  app.use('/api/milestone3', milestone3Router);
  app.use('/api/demo', demoRouter);
  app.use('/api/operations', demoRouter);

  // Catch-all for undefined /api routes so they return JSON instead of Vite HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.method} ${req.path} not found on FinCore server.`,
    });
  });

  // Global error handler for API
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.error('[API EXCEPTION]', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    }
    next(err);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinCore Secure Digital Banking Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
