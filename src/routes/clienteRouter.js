import express from 'express';
import { createCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/clientes', createCliente);

export default router;