import express from 'express';
import { createProducto, updateProducto, getAllProductos, deleteProducto, getProductoById } from '../controllers/productoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProductos);
router.post('/', authenticate, createProducto);
router.get('/:id', getProductoById);
router.put('/:id', authenticate, updateProducto);
router.delete('/:id', authenticate, deleteProducto);

export default router;