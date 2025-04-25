import { Router } from 'express';
import * as EquipamentoController from '../controllers/equipamentoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de equipamentos são protegidas
router.use(authMiddleware);

router.get('/', EquipamentoController.getAllEquipamentos);
router.get('/:id', EquipamentoController.getEquipamentoById);
router.post('/', EquipamentoController.createEquipamento);
router.put('/:id', EquipamentoController.updateEquipamento);
router.delete('/:id', EquipamentoController.deleteEquipamento);

export default router;
