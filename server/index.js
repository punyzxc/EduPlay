import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDatabase } from './database/db.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import { basicRateLimit, errorHandler, notFoundHandler } from './middleware/security.js';

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json({ limit: '20kb' }));
app.use(morgan('tiny'));

app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    service: 'eduplay-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use(basicRateLimit({ windowMs: 60_000, maxRequests: 240 }));
app.use('/', leaderboardRoutes);
app.use('/api', leaderboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[eduplay-backend] listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('[eduplay-backend] failed to initialize database', error);
    process.exit(1);
  });
