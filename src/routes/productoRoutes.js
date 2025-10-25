import express from 'express';
import { createProducto, updateProducto } from '../controllers/productoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createProducto);
router.put('/:id', updateProducto);

export default router;