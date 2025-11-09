import express from 'express';
import { getAllVentas } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/ventas', authenticate, getAllVentas);

export default router;