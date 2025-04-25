import { Router } from 'express';
import * as ManutencaoController from '../controllers/manutencaoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de manutenções são protegidas
router.use(authMiddleware);

router.get('/', ManutencaoController.getAllManutencoes);
router.get('/:id', ManutencaoController.getManutencaoById);
router.post('/', ManutencaoController.createManutencao);
router.put('/:id', ManutencaoController.updateManutencao);
router.delete('/:id', ManutencaoController.deleteManutencao);

export default router;
