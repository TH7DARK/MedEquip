import express from 'express';
import { 
  getAllMaintenance, 
  getMaintenanceById, 
  createMaintenance, 
  updateMaintenance, 
  deleteMaintenance,
  getMaintenanceByEquipment
} from '../controllers/maintenance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rotas protegidas
router.use(authMiddleware);

router.get('/', getAllMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', createMaintenance);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);
router.get('/equipment/:equipmentId', getMaintenanceByEquipment);

export default router;
