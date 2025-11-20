import express from 'express';
import { createVenta, getVentaById, getVentasPaginated } from '../controllers/ventaController.js';

const router = express.Router();

router.post('/', createVenta);
router.get('/', getVentasPaginated);
router.get('/:id', getVentaById);

export default router;