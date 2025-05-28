import { Router } from 'express';
import { buscarSolucoes, buscarInformacoesEquipamento } from '../services/iaService';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de IA são protegidas
router.use(authMiddleware);

// Rota para buscar soluções para problemas
router.post('/solucoes', async (req, res) => {
  try {
    const { marca, modelo, problema } = req.body;
    
    if (!marca || !modelo || !problema) {
      return res.status(400).json({ 
        error: 'Marca, modelo e descrição do problema são obrigatórios' 
      });
    }
    
    const solucoes = await buscarSolucoes({ marca, modelo }, problema);
    return res.json(solucoes);
  } catch (error) {
    console.error('Erro ao buscar soluções:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro ao buscar soluções' 
    });
  }
});

// Rota para buscar informações sobre equipamentos
router.post('/informacoes-equipamento', async (req, res) => {
  try {
    const { marca, modelo } = req.body;
    
    if (!marca || !modelo) {
      return res.status(400).json({ 
        error: 'Marca e modelo são obrigatórios' 
      });
    }
    
    const informacoes = await buscarInformacoesEquipamento(marca, modelo);
    return res.json(informacoes);
  } catch (error) {
    console.error('Erro ao buscar informações do equipamento:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro ao buscar informações do equipamento' 
    });
  }
});

export default router;
