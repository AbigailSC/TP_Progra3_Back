import express from 'express';
import { getAllVentas, getAllProductos, exportVentas, login, dashboard } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/login-view', login);
router.get('/dashboard-view', dashboard);

router.get('/ventas', authenticate, getAllVentas);
router.get('/ventas/total-by-current-month', authenticate);
router.get('/productos', authenticate, getAllProductos);
router.post('/export-ventas', authenticate, exportVentas);

export default router;