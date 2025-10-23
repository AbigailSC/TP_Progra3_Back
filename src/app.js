import express from 'express';

import tipoRoutes from './routes/tipoRoutes.js';
import usuarioRoutes from './routes/usuarioRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tipos', tipoRoutes);
app.use('/api/usuarios', usuarioRoutes);

export default app;