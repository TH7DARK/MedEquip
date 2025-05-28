import { Request, Response } from 'express';
import { prisma } from '../server';

// Listar todas as manutenções (com filtros)
export const getAllMaintenance = async (req: Request, res: Response) => {
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
    
    const maintenance = await prisma.maintenance.findMany({
      where,
      orderBy: { executionDate: 'desc' },
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
        }
      }
    });
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error('Erro ao listar manutenções:', error);
    res.status(500).json({ message: 'Erro ao listar manutenções' });
  }
};

// Obter detalhes de uma manutenção específica
export const getMaintenanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: Number(id) },
      include: {
        equipment: true,
        alerts: true
      }
    });
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Manutenção não encontrada' });
    }
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error('Erro ao obter detalhes da manutenção:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes da manutenção' });
  }
};

// Adicionar nova manutenção
export const createMaintenance = async (req: Request, res: Response) => {
  try {
    const {
      equipmentId,
      type,
      status,
      executionDate,
      nextMaintenanceDate,
      technician,
      serviceTime,
      cost,
      replacedParts,
      serviceDescription,
      additionalNotes
    } = req.body;
    
    // Verificar se o equipamento existe
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(equipmentId) }
    });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    // Obter ID do usuário do token (middleware de autenticação)
    const userId = (req as any).user?.userId;
    
    // Criar nova manutenção
    const maintenance = await prisma.maintenance.create({
      data: {
        equipmentId: Number(equipmentId),
        type,
        status,
        executionDate: new Date(executionDate),
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        technician,
        serviceTime: serviceTime ? Number(serviceTime) : null,
        cost: cost ? Number(cost) : null,
        replacedParts,
        serviceDescription,
        additionalNotes,
        createdBy: userId
      }
    });
    
    // Atualizar status do equipamento, se necessário
    if (status === 'completed' && equipment.status === 'maintenance') {
      await prisma.equipment.update({
        where: { id: Number(equipmentId) },
        data: { status: 'active' }
      });
    } else if (status === 'in_progress' && equipment.status === 'active') {
      await prisma.equipment.update({
        where: { id: Number(equipmentId) },
        data: { status: 'maintenance' }
      });
    }
    
    // Criar alerta para próxima manutenção, se aplicável
    if (nextMaintenanceDate) {
      await prisma.alert.create({
        data: {
          equipmentId: Number(equipmentId),
          maintenanceId: maintenance.id,
          type: 'maintenance',
          status: 'pending',
          dueDate: new Date(nextMaintenanceDate),
          message: `Manutenção ${type === 'preventive' ? 'preventiva' : 'corretiva'} programada para o equipamento ${equipment.brand} ${equipment.model || ''} (${equipment.serialNumber}).`
        }
      });
    }
    
    res.status(201).json({
      message: 'Manutenção registrada com sucesso',
      maintenance
    });
  } catch (error) {
    console.error('Erro ao registrar manutenção:', error);
    res.status(500).json({ message: 'Erro ao registrar manutenção' });
  }
};

// Atualizar informações de uma manutenção
export const updateMaintenance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      type,
      status,
      executionDate,
      nextMaintenanceDate,
      technician,
      serviceTime,
      cost,
      replacedParts,
      serviceDescription,
      additionalNotes
    } = req.body;
    
    // Verificar se a manutenção existe
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id: Number(id) },
      include: { equipment: true }
    });
    
    if (!existingMaintenance) {
      return res.status(404).json({ message: 'Manutenção não encontrada' });
    }
    
    // Atualizar manutenção
    const maintenance = await prisma.maintenance.update({
      where: { id: Number(id) },
      data: {
        type,
        status,
        executionDate: executionDate ? new Date(executionDate) : undefined,
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        technician,
        serviceTime: serviceTime ? Number(serviceTime) : null,
        cost: cost ? Number(cost) : null,
        replacedParts,
        serviceDescription,
        additionalNotes
      }
    });
    
    // Atualizar status do equipamento, se necessário
    if (status !== existingMaintenance.status) {
      if (status === 'completed' && existingMaintenance.equipment.status === 'maintenance') {
        await prisma.equipment.update({
          where: { id: existingMaintenance.equipmentId },
          data: { status: 'active' }
        });
      } else if (status === 'in_progress' && existingMaintenance.equipment.status === 'active') {
        await prisma.equipment.update({
          where: { id: existingMaintenance.equipmentId },
          data: { status: 'maintenance' }
        });
      }
    }
    
    // Atualizar ou criar alerta para próxima manutenção, se aplicável
    if (nextMaintenanceDate) {
      const existingAlert = await prisma.alert.findFirst({
        where: {
          maintenanceId: Number(id),
          type: 'maintenance'
        }
      });
      
      if (existingAlert) {
        await prisma.alert.update({
          where: { id: existingAlert.id },
          data: {
            dueDate: new Date(nextMaintenanceDate),
            message: `Manutenção ${type === 'preventive' ? 'preventiva' : 'corretiva'} programada para o equipamento ${existingMaintenance.equipment.brand} ${existingMaintenance.equipment.model || ''} (${existingMaintenance.equipment.serialNumber}).`
          }
        });
      } else {
        await prisma.alert.create({
          data: {
            equipmentId: existingMaintenance.equipmentId,
            maintenanceId: Number(id),
            type: 'maintenance',
            status: 'pending',
            dueDate: new Date(nextMaintenanceDate),
            message: `Manutenção ${type === 'preventive' ? 'preventiva' : 'corretiva'} programada para o equipamento ${existingMaintenance.equipment.brand} ${existingMaintenance.equipment.model || ''} (${existingMaintenance.equipment.serialNumber}).`
          }
        });
      }
    } else {
      // Se a data da próxima manutenção foi removida, cancelar alertas existentes
      await prisma.alert.updateMany({
        where: {
          maintenanceId: Number(id),
          type: 'maintenance',
          status: 'pending'
        },
        data: { status: 'canceled' }
      });
    }
    
    res.status(200).json({
      message: 'Manutenção atualizada com sucesso',
      maintenance
    });
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error);
    res.status(500).json({ message: 'Erro ao atualizar manutenção' });
  }
};

// Remover uma manutenção
export const deleteMaintenance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se a manutenção existe
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: Number(id) }
    });
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Manutenção não encontrada' });
    }
    
    // Remover alertas relacionados
    await prisma.alert.deleteMany({
      where: { maintenanceId: Number(id) }
    });
    
    // Remover manutenção
    await prisma.maintenance.delete({
      where: { id: Number(id) }
    });
    
    res.status(200).json({ message: 'Manutenção removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover manutenção:', error);
    res.status(500).json({ message: 'Erro ao remover manutenção' });
  }
};

// Listar manutenções de um equipamento
export const getMaintenanceByEquipment = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;
    
    const maintenance = await prisma.maintenance.findMany({
      where: { equipmentId: Number(equipmentId) },
      orderBy: { executionDate: 'desc' }
    });
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error('Erro ao listar manutenções do equipamento:', error);
    res.status(500).json({ message: 'Erro ao listar manutenções do equipamento' });
  }
};
