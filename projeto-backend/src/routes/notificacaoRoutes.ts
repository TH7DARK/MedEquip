import { Router } from 'express';
import { verificarEEnviarAlertas } from '../services/alertaService';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Rota protegida para acionar o envio de alertas manualmente
router.post('/enviar', authMiddleware, async (req, res) => {
  try {
    const alertasEnviados = await verificarEEnviarAlertas();
    return res.json({ 
      success: true, 
      message: `${alertasEnviados} alertas verificados e enviados com sucesso` 
    });
  } catch (error) {
    console.error('Erro ao acionar envio de alertas:', error);
    return res.status(500).json({ error: 'Erro ao acionar envio de alertas' });
  }
});

export default router;
