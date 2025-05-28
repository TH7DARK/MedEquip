import express from 'express';
import { 
  getAllAlerts, 
  getAlertById, 
  createAlert, 
  updateAlert, 
  deleteAlert,
  getAlertsByEquipment
} from '../controllers/alert.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rotas protegidas
router.use(authMiddleware);

router.get('/', getAllAlerts);
router.get('/:id', getAlertById);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);
router.get('/equipment/:equipmentId', getAlertsByEquipment);

export default router;
