import { Request, Response } from 'express';
import { prisma } from '../server';

// Listar todos os alertas (com filtros)
export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const { type, status, equipmentId } = req.query;
    
    // Construir filtros
    let where: any = {};
    
    if (type) {
      where.type = type as string;
    }
    
    if (status) {
      where.status = status as string;
    }
    
    if (equipmentId) {
      where.equipmentId = Number(equipmentId);
    }
    
    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        equipment: {
          select: {
            id: true,
            serialNumber: true,
            brand: true,
            model: true,
            unit: true,
            city: true
          }
        },
        maintenance: {
          select: {
            id: true,
            type: true,
            executionDate: true
          }
        }
      }
    });
    
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Erro ao listar alertas:', error);
    res.status(500).json({ message: 'Erro ao listar alertas' });
  }
};

// Obter detalhes de um alerta específico
export const getAlertById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const alert = await prisma.alert.findUnique({
      where: { id: Number(id) },
      include: {
        equipment: true,
        maintenance: true
      }
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta não encontrado' });
    }
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Erro ao obter detalhes do alerta:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do alerta' });
  }
};

// Adicionar novo alerta
export const createAlert = async (req: Request, res: Response) => {
  try {
    const {
      equipmentId,
      maintenanceId,
      type,
      status,
      dueDate,
      message
    } = req.body;
    
    // Verificar se o equipamento existe
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(equipmentId) }
    });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    // Verificar se a manutenção existe, se fornecida
    if (maintenanceId) {
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: Number(maintenanceId) }
      });
      
      if (!maintenance) {
        return res.status(404).json({ message: 'Manutenção não encontrada' });
      }
    }
    
    // Criar novo alerta
    const alert = await prisma.alert.create({
      data: {
        equipmentId: Number(equipmentId),
        maintenanceId: maintenanceId ? Number(maintenanceId) : null,
        type,
        status: status || 'pending',
        dueDate: new Date(dueDate),
        message
      }
    });
    
    res.status(201).json({
      message: 'Alerta criado com sucesso',
      alert
    });
  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    res.status(500).json({ message: 'Erro ao criar alerta' });
  }
};

// Atualizar status de um alerta
export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    
    // Verificar se o alerta existe
    const alert = await prisma.alert.findUnique({
      where: { id: Number(id) }
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta não encontrado' });
    }
    
    // Atualizar alerta
    const updatedAlert = await prisma.alert.update({
      where: { id: Number(id) },
      data: {
        status,
        message: message || alert.message
      }
    });
    
    res.status(200).json({
      message: 'Alerta atualizado com sucesso',
      alert: updatedAlert
    });
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error);
    res.status(500).json({ message: 'Erro ao atualizar alerta' });
  }
};

// Remover um alerta
export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o alerta existe
    const alert = await prisma.alert.findUnique({
      where: { id: Number(id) }
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta não encontrado' });
    }
    
    // Remover alerta
    await prisma.alert.delete({
      where: { id: Number(id) }
    });
    
    res.status(200).json({ message: 'Alerta removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover alerta:', error);
    res.status(500).json({ message: 'Erro ao remover alerta' });
  }
};

// Listar alertas de um equipamento
export const getAlertsByEquipment = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;
    
    const alerts = await prisma.alert.findMany({
      where: { equipmentId: Number(equipmentId) },
      orderBy: { dueDate: 'asc' },
      include: {
        maintenance: true
      }
    });
    
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Erro ao listar alertas do equipamento:', error);
    res.status(500).json({ message: 'Erro ao listar alertas do equipamento' });
  }
};
