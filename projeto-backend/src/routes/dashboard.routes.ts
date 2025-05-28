import express from 'express';
import { 
  getEquipmentStatusStats, 
  getMaintenanceByMonth, 
  getMaintenanceCosts, 
  getEquipmentMaintenanceFrequency
} from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rotas protegidas
router.use(authMiddleware);

router.get('/equipment-status', getEquipmentStatusStats);
router.get('/maintenance-by-month', getMaintenanceByMonth);
router.get('/maintenance-costs', getMaintenanceCosts);
router.get('/equipment-maintenance-frequency', getEquipmentMaintenanceFrequency);

export default router;
