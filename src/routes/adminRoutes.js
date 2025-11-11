import express from 'express';
import { getAllVentas, getAllProductos, exportVentas } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

router.get('/ventas', authenticate, getAllVentas);
router.get('/productos', authenticate, getAllProductos);
router.post('/export-ventas', authenticate, exportVentas);

export default router;