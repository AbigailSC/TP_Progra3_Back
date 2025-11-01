import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import tipoRoutes from './routes/tipoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';
import carritoItemsRoutes from './routes/carritoItemsRoutes.js'

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tipos', tipoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/carritos', carritoRoutes);
app.use('/api/carrito-items', carritoItemsRoutes);

export default app;