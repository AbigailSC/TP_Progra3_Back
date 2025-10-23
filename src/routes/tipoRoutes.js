import express from 'express';
import { getAllTipos } from '../controllers/tipoController.js';

const router = express.Router();

router.get('/', getAllTipos);

export default router;