import express from 'express';
import { createCarrito, getActiveCarrito, updateEstadoCarrito } from '../controllers/carritoController.js';

const router = express.Router();

router.post('/', createCarrito);
router.get('/:cliente_id', getActiveCarrito);
router.put('/:carrito_id', updateEstadoCarrito);

export default router;