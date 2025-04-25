import { Router } from 'express';
import * as DashboardController from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de dashboard são protegidas
router.use(authMiddleware);

router.get('/', DashboardController.getDashboardData);

export default router;
