import express from 'express';
import { login, getProfile, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', getProfile);

export default router;