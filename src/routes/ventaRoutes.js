import express from 'express';
import { createVenta, getVentaById, getAllVentas } from '../controllers/ventaController.js';

const router = express.Router();

router.post('/', createVenta);
router.get('/', getAllVentas);
router.get('/:id', getVentaById);

export default router;