import { Router } from 'express';
import * as AlertaController from '../controllers/alertaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de alertas são protegidas
router.use(authMiddleware);

router.get('/', AlertaController.getAllAlertas);
router.get('/pendentes', AlertaController.getAlertasPendentes);
router.get('/:id', AlertaController.getAlertaById);
router.post('/', AlertaController.createAlerta);
router.put('/:id', AlertaController.updateAlerta);
router.delete('/:id', AlertaController.deleteAlerta);

export default router;
