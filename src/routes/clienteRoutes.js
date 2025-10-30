import express from 'express';
import { createCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/', createCliente);

export default router;