import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllManutencoes = async (req: Request, res: Response) => {
  try {
    const manutencoes = await prisma.manutencao.findMany({
      include: {
        equipamento: {
          include: {
            categoria: true,
            unidade: true
          }
        },
        tecnicoResponsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        }
      },
      orderBy: {
        dataRealizacao: 'desc'
      }
    });
    
    return res.json(manutencoes);
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error);
    return res.status(500).json({ error: 'Erro ao buscar manutenções' });
  }
};

export const getManutencaoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const manutencao = await prisma.manutencao.findUnique({
      where: { id: Number(id) },
      include: {
        equipamento: {
          include: {
            categoria: true,
            unidade: true
          }
        },
        tecnicoResponsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        },
        alerta: true
      }
    });
    
    if (!manutencao) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }
    
    return res.json(manutencao);
  } catch (error) {
    console.error('Erro ao buscar manutenção:', error);
    return res.status(500).json({ error: 'Erro ao buscar manutenção' });
  }
};

export const createManutencao = async (req: Request, res: Response) => {
  try {
    const {
      tipo,
      status,
      dataRealizacao,
      dataProximaManutencao,
      tecnicoResponsavelId,
      tempoServico,
      custo,
      pecasSubstituidas,
      descricaoServico,
      observacoes,
      equipamentoId
    } = req.body;
    
    // Verificar se o equipamento existe
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: Number(equipamentoId) }
    });
    
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    // Verificar se o técnico existe
    const tecnico = await prisma.usuario.findUnique({
      where: { id: Number(tecnicoResponsavelId) }
    });
    
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico responsável não encontrado' });
    }
    
    // Criar a manutenção
    const manutencao = await prisma.manutencao.create({
      data: {
        tipo,
        status,
        dataRealizacao: new Date(dataRealizacao),
        dataProximaManutencao: dataProximaManutencao ? new Date(dataProximaManutencao) : null,
        tempoServico: tempoServico ? Number(tempoServico) : null,
        custo: custo ? Number(custo) : null,
        pecasSubstituidas,
        descricaoServico,
        observacoes,
        equipamento: {
          connect: { id: Number(equipamentoId) }
        },
        tecnicoResponsavel: {
          connect: { id: Number(tecnicoResponsavelId) }
        }
      },
      include: {
        equipamento: true,
        tecnicoResponsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        }
      }
    });
    
    // Se houver data para próxima manutenção, criar um alerta
    if (dataProximaManutencao) {
      await prisma.alerta.create({
        data: {
          dataAlerta: new Date(dataProximaManutencao),
          status: 'Pendente',
          mensagem: `Manutenção ${tipo} programada para o equipamento ${equipamento.nome}`,
          equipamento: {
            connect: { id: Number(equipamentoId) }
          },
          manutencao: {
            connect: { id: manutencao.id }
          }
        }
      });
      
      // Atualizar o status do equipamento se for uma manutenção em andamento
      if (status === 'Em andamento') {
        await prisma.equipamento.update({
          where: { id: Number(equipamentoId) },
          data: { status: 'Em manutenção' }
        });
      }
    }
    
    return res.status(201).json(manutencao);
  } catch (error) {
    console.error('Erro ao criar manutenção:', error);
    return res.status(500).json({ error: 'Erro ao criar manutenção' });
  }
};

export const updateManutencao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      tipo,
      status,
      dataRealizacao,
      dataProximaManutencao,
      tecnicoResponsavelId,
      tempoServico,
      custo,
      pecasSubstituidas,
      descricaoServico,
      observacoes,
      equipamentoId
    } = req.body;
    
    // Verificar se a manutenção existe
    const manutencaoExists = await prisma.manutencao.findUnique({
      where: { id: Number(id) },
      include: {
        alerta: true
      }
    });
    
    if (!manutencaoExists) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }
    
    // Atualizar a manutenção
    const manutencao = await prisma.manutencao.update({
      where: { id: Number(id) },
      data: {
        tipo,
        status,
        dataRealizacao: dataRealizacao ? new Date(dataRealizacao) : undefined,
        dataProximaManutencao: dataProximaManutencao ? new Date(dataProximaManutencao) : null,
        tempoServico: tempoServico ? Number(tempoServico) : null,
        custo: custo ? Number(custo) : null,
        pecasSubstituidas,
        descricaoServico,
        observacoes,
        equipamentoId: equipamentoId ? Number(equipamentoId) : undefined,
        tecnicoResponsavelId: tecnicoResponsavelId ? Number(tecnicoResponsavelId) : undefined
      },
      include: {
        equipamento: true,
        tecnicoResponsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true
          }
        },
        alerta: true
      }
    });
    
    // Atualizar ou criar alerta se houver data para próxima manutenção
    if (dataProximaManutencao) {
      if (manutencaoExists.alerta) {
        await prisma.alerta.update({
          where: { id: manutencaoExists.alerta.id },
          data: {
            dataAlerta: new Date(dataProximaManutencao),
            status: 'Pendente',
            mensagem: `Manutenção ${tipo} programada para o equipamento ${manutencao.equipamento.nome}`
          }
        });
      } else {
        await prisma.alerta.create({
          data: {
            dataAlerta: new Date(dataProximaManutencao),
            status: 'Pendente',
            mensagem: `Manutenção ${tipo} programada para o equipamento ${manutencao.equipamento.nome}`,
            equipamento: {
              connect: { id: manutencao.equipamentoId }
            },
            manutencao: {
              connect: { id: manutencao.id }
            }
          }
        });
      }
    }
    
    // Atualizar o status do equipamento com base no status da manutenção
    if (status === 'Concluída') {
      await prisma.equipamento.update({
        where: { id: manutencao.equipamentoId },
        data: { status: 'Ativo' }
      });
    } else if (status === 'Em andamento') {
      await prisma.equipamento.update({
        where: { id: manutencao.equipamentoId },
        data: { status: 'Em manutenção' }
      });
    }
    
    return res.json(manutencao);
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error);
    return res.status(500).json({ error: 'Erro ao atualizar manutenção' });
  }
};

export const deleteManutencao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se a manutenção existe
    const manutencaoExists = await prisma.manutencao.findUnique({
      where: { id: Number(id) },
      include: {
        alerta: true
      }
    });
    
    if (!manutencaoExists) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }
    
    // Excluir alerta associado, se existir
    if (manutencaoExists.alerta) {
      await prisma.alerta.delete({
        where: { id: manutencaoExists.alerta.id }
      });
    }
    
    // Excluir a manutenção
    await prisma.manutencao.delete({
      where: { id: Number(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir manutenção:', error);
    return res.status(500).json({ error: 'Erro ao excluir manutenção' });
  }
};
