import { Router } from 'express';
import * as AuthController from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Rotas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rotas protegidas
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;
