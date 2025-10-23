import express from 'express';

import tipoRoutes from './routes/tipoRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tipos', tipoRoutes);

export default app;