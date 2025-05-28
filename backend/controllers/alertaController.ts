import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllAlertas = async (req: Request, res: Response) => {
  try {
    const alertas = await prisma.alerta.findMany({
      include: {
        equipamento: {
          include: {
            categoria: true,
            unidade: true
          }
        },
        manutencao: {
          include: {
            tecnicoResponsavel: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true
              }
            }
          }
        }
      },
      orderBy: {
        dataAlerta: 'asc'
      }
    });
    
    return res.json(alertas);
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    return res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
};

export const getAlertaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const alerta = await prisma.alerta.findUnique({
      where: { id: Number(id) },
      include: {
        equipamento: {
          include: {
            categoria: true,
            unidade: true
          }
        },
        manutencao: {
          include: {
            tecnicoResponsavel: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true
              }
            }
          }
        }
      }
    });
    
    if (!alerta) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    return res.json(alerta);
  } catch (error) {
    console.error('Erro ao buscar alerta:', error);
    return res.status(500).json({ error: 'Erro ao buscar alerta' });
  }
};

export const createAlerta = async (req: Request, res: Response) => {
  try {
    const {
      dataAlerta,
      status,
      mensagem,
      equipamentoId,
      manutencaoId
    } = req.body;
    
    // Verificar se o equipamento existe
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: Number(equipamentoId) }
    });
    
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    // Criar dados base do alerta
    const alertaData: any = {
      dataAlerta: new Date(dataAlerta),
      status: status || 'Pendente',
      mensagem,
      equipamento: {
        connect: { id: Number(equipamentoId) }
      }
    };
    
    // Adicionar conexão com manutenção se fornecida
    if (manutencaoId) {
      // Verificar se a manutenção existe
      const manutencao = await prisma.manutencao.findUnique({
        where: { id: Number(manutencaoId) }
      });
      
      if (!manutencao) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }
      
      alertaData.manutencao = {
        connect: { id: Number(manutencaoId) }
      };
    }
    
    // Criar o alerta
    const alerta = await prisma.alerta.create({
      data: alertaData,
      include: {
        equipamento: true,
        manutencao: {
          include: {
            tecnicoResponsavel: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true
              }
            }
          }
        }
      }
    });
    
    return res.status(201).json(alerta);
  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    return res.status(500).json({ error: 'Erro ao criar alerta' });
  }
};

export const updateAlerta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      dataAlerta,
      status,
      mensagem
    } = req.body;
    
    // Verificar se o alerta existe
    const alertaExists = await prisma.alerta.findUnique({
      where: { id: Number(id) }
    });
    
    if (!alertaExists) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    // Atualizar o alerta
    const alerta = await prisma.alerta.update({
      where: { id: Number(id) },
      data: {
        dataAlerta: dataAlerta ? new Date(dataAlerta) : undefined,
        status,
        mensagem
      },
      include: {
        equipamento: true,
        manutencao: {
          include: {
            tecnicoResponsavel: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true
              }
            }
          }
        }
      }
    });
    
    return res.json(alerta);
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error);
    return res.status(500).json({ error: 'Erro ao atualizar alerta' });
  }
};

export const deleteAlerta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o alerta existe
    const alertaExists = await prisma.alerta.findUnique({
      where: { id: Number(id) }
    });
    
    if (!alertaExists) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    // Excluir o alerta
    await prisma.alerta.delete({
      where: { id: Number(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir alerta:', error);
    return res.status(500).json({ error: 'Erro ao excluir alerta' });
  }
};

// Obter alertas pendentes para o dia atual e próximo dia
export const getAlertasPendentes = async (req: Request, res: Response) => {
  try {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    // Definir início e fim do dia para hoje
    const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0));
    const fimHoje = new Date(hoje.setHours(23, 59, 59, 999));
    
    // Definir início e fim do dia para amanhã
    const inicioAmanha = new Date(amanha.setHours(0, 0, 0, 0));
    const fimAmanha = new Date(amanha.setHours(23, 59, 59, 999));
    
    const alertas = await prisma.alerta.findMany({
      where: {
        status: 'Pendente',
        dataAlerta: {
          gte: inicioHoje,
          lte: fimAmanha
        }
      },
      include: {
        equipamento: {
          include: {
            categoria: true,
            unidade: true
          }
        },
        manutencao: {
          include: {
            tecnicoResponsavel: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true
              }
            }
          }
        }
      },
      orderBy: {
        dataAlerta: 'asc'
      }
    });
    
    return res.json(alertas);
  } catch (error) {
    console.error('Erro ao buscar alertas pendentes:', error);
    return res.status(500).json({ error: 'Erro ao buscar alertas pendentes' });
  }
};
