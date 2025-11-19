import express from 'express';
import { getAllVentas, getAllProductos, exportVentas, login, dashboard, getVentasSemanales } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/login-view', login);
router.get('/dashboard-view', dashboard);
router.get('/ventas-view', getAllVentas);
router.get('/productos-view', getAllProductos);

router.get('/ventas-semanales', authenticate, getVentasSemanales);
router.post('/export-ventas', authenticate, exportVentas);

export default router;