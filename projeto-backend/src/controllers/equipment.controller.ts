import { Request, Response } from 'express';
import { prisma } from '../server';

// Listar todos os equipamentos (com filtros)
export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const { status, search, unit, city } = req.query;
    
    // Construir filtros
    let where: any = {};
    
    if (status) {
      where.status = status as string;
    }
    
    if (unit) {
      where.unit = unit as string;
    }
    
    if (city) {
      where.city = city as string;
    }
    
    if (search) {
      where.OR = [
        { serialNumber: { contains: search as string } },
        { brand: { contains: search as string } },
        { model: { contains: search as string } }
      ];
    }
    
    const equipment = await prisma.equipment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        maintenance: {
          orderBy: { executionDate: 'desc' },
          take: 1
        }
      }
    });
    
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Erro ao listar equipamentos:', error);
    res.status(500).json({ message: 'Erro ao listar equipamentos' });
  }
};

// Obter detalhes de um equipamento específico
export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
      include: {
        maintenance: {
          orderBy: { executionDate: 'desc' }
        },
        alerts: {
          where: { status: 'pending' },
          orderBy: { dueDate: 'asc' }
        }
      }
    });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Erro ao obter detalhes do equipamento:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do equipamento' });
  }
};

// Adicionar novo equipamento
export const createEquipment = async (req: Request, res: Response) => {
  try {
    const {
      serialNumber,
      invoiceNumber,
      brand,
      model,
      unit,
      city,
      supportPhone,
      status,
      acquisitionDate,
      warrantyUntil,
      imageUrl,
      manualUrl,
      description
    } = req.body;
    
    // Verificar se já existe equipamento com o mesmo número de série
    const existingEquipment = await prisma.equipment.findUnique({
      where: { serialNumber }
    });
    
    if (existingEquipment) {
      return res.status(400).json({ message: 'Já existe um equipamento com este número de série' });
    }
    
    // Obter ID do usuário do token (middleware de autenticação)
    const userId = (req as any).user?.userId;
    
    // Criar novo equipamento
    const equipment = await prisma.equipment.create({
      data: {
        serialNumber,
        invoiceNumber,
        brand,
        model,
        unit,
        city,
        supportPhone,
        status: status || 'active',
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : null,
        imageUrl,
        manualUrl,
        description,
        createdBy: userId
      }
    });
    
    // Criar alerta para garantia, se aplicável
    if (warrantyUntil) {
      await prisma.alert.create({
        data: {
          equipmentId: equipment.id,
          type: 'warranty',
          status: 'pending',
          dueDate: new Date(warrantyUntil),
          message: `A garantia do equipamento ${brand} ${model || ''} (${serialNumber}) expira nesta data.`
        }
      });
    }
    
    res.status(201).json({
      message: 'Equipamento cadastrado com sucesso',
      equipment
    });
  } catch (error) {
    console.error('Erro ao cadastrar equipamento:', error);
    res.status(500).json({ message: 'Erro ao cadastrar equipamento' });
  }
};

// Atualizar informações de um equipamento
export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      serialNumber,
      invoiceNumber,
      brand,
      model,
      unit,
      city,
      supportPhone,
      status,
      acquisitionDate,
      warrantyUntil,
      imageUrl,
      manualUrl,
      description
    } = req.body;
    
    // Verificar se o equipamento existe
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingEquipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    // Verificar se o número de série já está em uso por outro equipamento
    if (serialNumber && serialNumber !== existingEquipment.serialNumber) {
      const duplicateSerialNumber = await prisma.equipment.findUnique({
        where: { serialNumber }
      });
      
      if (duplicateSerialNumber) {
        return res.status(400).json({ message: 'Já existe um equipamento com este número de série' });
      }
    }
    
    // Atualizar equipamento
    const equipment = await prisma.equipment.update({
      where: { id: Number(id) },
      data: {
        serialNumber,
        invoiceNumber,
        brand,
        model,
        unit,
        city,
        supportPhone,
        status,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        warrantyUntil: warrantyUntil ? new Date(warrantyUntil) : null,
        imageUrl,
        manualUrl,
        description
      }
    });
    
    // Atualizar ou criar alerta de garantia, se aplicável
    if (warrantyUntil) {
      const existingAlert = await prisma.alert.findFirst({
        where: {
          equipmentId: Number(id),
          type: 'warranty'
        }
      });
      
      if (existingAlert) {
        await prisma.alert.update({
          where: { id: existingAlert.id },
          data: {
            dueDate: new Date(warrantyUntil),
            message: `A garantia do equipamento ${brand} ${model || ''} (${serialNumber}) expira nesta data.`
          }
        });
      } else {
        await prisma.alert.create({
          data: {
            equipmentId: Number(id),
            type: 'warranty',
            status: 'pending',
            dueDate: new Date(warrantyUntil),
            message: `A garantia do equipamento ${brand} ${model || ''} (${serialNumber}) expira nesta data.`
          }
        });
      }
    }
    
    res.status(200).json({
      message: 'Equipamento atualizado com sucesso',
      equipment
    });
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    res.status(500).json({ message: 'Erro ao atualizar equipamento' });
  }
};

// Remover um equipamento
export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o equipamento existe
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) }
    });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    // Remover alertas relacionados
    await prisma.alert.deleteMany({
      where: { equipmentId: Number(id) }
    });
    
    // Remover manutenções relacionadas
    await prisma.maintenance.deleteMany({
      where: { equipmentId: Number(id) }
    });
    
    // Remover equipamento
    await prisma.equipment.delete({
      where: { id: Number(id) }
    });
    
    res.status(200).json({ message: 'Equipamento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover equipamento:', error);
    res.status(500).json({ message: 'Erro ao remover equipamento' });
  }
};

// Buscar informações automáticas (foto, manual)
export const searchEquipmentInfo = async (req: Request, res: Response) => {
  try {
    const { brand, model } = req.body;
    
    // Aqui seria implementada a lógica para buscar informações usando IA ou APIs externas
    // Por enquanto, retornamos dados simulados
    
    const mockData = {
      imageUrl: `https://example.com/images/${brand.toLowerCase()}-${model.toLowerCase()}.jpg`,
      manualUrl: `https://example.com/manuals/${brand.toLowerCase()}-${model.toLowerCase()}.pdf`,
      description: `Equipamento médico ${brand} modelo ${model}. Este é um texto de exemplo que seria gerado por uma API de IA.`
    };
    
    res.status(200).json(mockData);
  } catch (error) {
    console.error('Erro ao buscar informações do equipamento:', error);
    res.status(500).json({ message: 'Erro ao buscar informações do equipamento' });
  }
};
