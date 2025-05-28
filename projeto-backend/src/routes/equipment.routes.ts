import express from 'express';
import { 
  getAllEquipment, 
  getEquipmentById, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment,
  searchEquipmentInfo
} from '../controllers/equipment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Rotas protegidas
router.use(authMiddleware);

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);
router.post('/search-info', searchEquipmentInfo);

export default router;
