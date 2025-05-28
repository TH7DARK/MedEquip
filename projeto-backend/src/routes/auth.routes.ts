import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rotas protegidas
router.get('/me', authMiddleware, getMe);

export default router;
