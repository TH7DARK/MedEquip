import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllEquipamentos = async (req: Request, res: Response) => {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      include: {
        categoria: true,
        unidade: true
      }
    });
    
    return res.json(equipamentos);
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    return res.status(500).json({ error: 'Erro ao buscar equipamentos' });
  }
};

export const getEquipamentoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: Number(id) },
      include: {
        categoria: true,
        unidade: true,
        manutencoes: {
          include: {
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
        },
        alertas: true
      }
    });
    
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    return res.json(equipamento);
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error);
    return res.status(500).json({ error: 'Erro ao buscar equipamento' });
  }
};

export const createEquipamento = async (req: Request, res: Response) => {
  try {
    const {
      numeroSerie,
      nome,
      marca,
      modelo,
      dataAquisicao,
      valorAquisicao,
      status,
      garantiaAte,
      foto,
      manual,
      descricao,
      especificacoes,
      categoriaId,
      unidadeId
    } = req.body;
    
    // Verificar se o número de série já existe
    const equipamentoExists = await prisma.equipamento.findUnique({
      where: { numeroSerie }
    });
    
    if (equipamentoExists) {
      return res.status(400).json({ error: 'Já existe um equipamento com este número de série' });
    }
    
    const equipamento = await prisma.equipamento.create({
      data: {
        numeroSerie,
        nome,
        marca,
        modelo,
        dataAquisicao: new Date(dataAquisicao),
        valorAquisicao: valorAquisicao ? Number(valorAquisicao) : null,
        status,
        garantiaAte: garantiaAte ? new Date(garantiaAte) : null,
        foto,
        manual,
        descricao,
        especificacoes,
        categoria: {
          connect: { id: Number(categoriaId) }
        },
        unidade: {
          connect: { id: Number(unidadeId) }
        }
      },
      include: {
        categoria: true,
        unidade: true
      }
    });
    
    return res.status(201).json(equipamento);
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    return res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
};

export const updateEquipamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      numeroSerie,
      nome,
      marca,
      modelo,
      dataAquisicao,
      valorAquisicao,
      status,
      garantiaAte,
      foto,
      manual,
      descricao,
      especificacoes,
      categoriaId,
      unidadeId
    } = req.body;
    
    // Verificar se o equipamento existe
    const equipamentoExists = await prisma.equipamento.findUnique({
      where: { id: Number(id) }
    });
    
    if (!equipamentoExists) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    // Verificar se o número de série já está em uso por outro equipamento
    if (numeroSerie && numeroSerie !== equipamentoExists.numeroSerie) {
      const numeroSerieExists = await prisma.equipamento.findFirst({
        where: {
          numeroSerie,
          id: { not: Number(id) }
        }
      });
      
      if (numeroSerieExists) {
        return res.status(400).json({ error: 'Número de série já está em uso por outro equipamento' });
      }
    }
    
    const equipamento = await prisma.equipamento.update({
      where: { id: Number(id) },
      data: {
        numeroSerie,
        nome,
        marca,
        modelo,
        dataAquisicao: dataAquisicao ? new Date(dataAquisicao) : undefined,
        valorAquisicao: valorAquisicao ? Number(valorAquisicao) : null,
        status,
        garantiaAte: garantiaAte ? new Date(garantiaAte) : null,
        foto,
        manual,
        descricao,
        especificacoes,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        unidadeId: unidadeId ? Number(unidadeId) : undefined
      },
      include: {
        categoria: true,
        unidade: true
      }
    });
    
    return res.json(equipamento);
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    return res.status(500).json({ error: 'Erro ao atualizar equipamento' });
  }
};

export const deleteEquipamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o equipamento existe
    const equipamentoExists = await prisma.equipamento.findUnique({
      where: { id: Number(id) }
    });
    
    if (!equipamentoExists) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    
    // Verificar se existem manutenções associadas
    const manutencoesCount = await prisma.manutencao.count({
      where: { equipamentoId: Number(id) }
    });
    
    if (manutencoesCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir o equipamento pois existem manutenções associadas a ele' 
      });
    }
    
    // Excluir alertas associados
    await prisma.alerta.deleteMany({
      where: { equipamentoId: Number(id) }
    });
    
    // Excluir o equipamento
    await prisma.equipamento.delete({
      where: { id: Number(id) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir equipamento:', error);
    return res.status(500).json({ error: 'Erro ao excluir equipamento' });
  }
};
