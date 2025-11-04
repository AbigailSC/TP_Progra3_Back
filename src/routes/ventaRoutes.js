import express from 'express';
import { createVenta, getVentaById } from '../controllers/ventaController.js';

const router = express.Router();

router.post('/', createVenta);
router.get('/:id', getVentaById);

export default router;