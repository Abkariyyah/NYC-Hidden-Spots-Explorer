import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import spotRoutes from './routes/spotRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import prisma from './utils/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NYC Hidden Spots API is running' });
});

// Quick check: is the database connected and migrated?
app.get('/api/db-check', async (req, res) => {
  try {
    const spotCount = await prisma.hiddenSpot.count();
    res.json({ ok: true, spotCount, databaseUrl: process.env.DATABASE_URL?.slice(0, 20) + '...' });
  } catch (error) {
    console.error('DB check failed:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved', savedRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
