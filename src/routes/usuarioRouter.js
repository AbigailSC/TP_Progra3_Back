import express from 'express';
import { getAllUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;