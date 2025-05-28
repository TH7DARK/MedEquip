import { Request, Response } from 'express';
import { prisma } from '../server';

// Estatísticas de equipamentos por status
export const getEquipmentStatusStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count
      FROM equipment
      GROUP BY status
      ORDER BY count DESC
    `;
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas de equipamentos por status:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas de equipamentos por status' });
  }
};

// Manutenções realizadas por mês
export const getMaintenanceByMonth = async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    
    const currentYear = year ? Number(year) : new Date().getFullYear();
    
    // Consulta para obter manutenções por mês
    const stats = await prisma.$queryRaw`
      SELECT 
        strftime('%m', execution_date) as month,
        COUNT(*) as total,
        SUM(CASE WHEN type = 'preventive' THEN 1 ELSE 0 END) as preventive,
        SUM(CASE WHEN type = 'corrective' THEN 1 ELSE 0 END) as corrective
      FROM maintenance
      WHERE strftime('%Y', execution_date) = ${currentYear.toString()}
      GROUP BY month
      ORDER BY month
    `;
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas de manutenções por mês:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas de manutenções por mês' });
  }
};

// Custos de manutenção
export const getMaintenanceCosts = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    
    let dateFilter = '';
    const now = new Date();
    
    // Definir filtro de data com base no período
    if (period === 'month') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = `execution_date >= '${firstDayOfMonth.toISOString()}'`;
    } else if (period === 'quarter') {
      const firstDayOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      dateFilter = `execution_date >= '${firstDayOfQuarter.toISOString()}'`;
    } else if (period === 'year') {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = `execution_date >= '${firstDayOfYear.toISOString()}'`;
    } else {
      // Sem filtro, retorna todos os dados
      dateFilter = '1=1';
    }
    
    // Consulta para obter custos de manutenção
    const stats = await prisma.$queryRaw`
      SELECT 
        SUM(cost) as total_cost,
        AVG(cost) as average_cost,
        MAX(cost) as max_cost,
        SUM(CASE WHEN type = 'preventive' THEN cost ELSE 0 END) as preventive_cost,
        SUM(CASE WHEN type = 'corrective' THEN cost ELSE 0 END) as corrective_cost
      FROM maintenance
      WHERE ${dateFilter}
    `;
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas de custos de manutenção:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas de custos de manutenção' });
  }
};

// Frequência de manutenção por equipamento
export const getEquipmentMaintenanceFrequency = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    
    const limitValue = limit ? Number(limit) : 10;
    
    // Consulta para obter equipamentos com mais manutenções
    const stats = await prisma.$queryRaw`
      SELECT 
        e.id,
        e.serial_number as serialNumber,
        e.brand,
        e.model,
        e.unit,
        COUNT(m.id) as maintenance_count,
        SUM(m.cost) as total_cost
      FROM equipment e
      JOIN maintenance m ON e.id = m.equipment_id
      GROUP BY e.id
      ORDER BY maintenance_count DESC
      LIMIT ${limitValue}
    `;
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao obter frequência de manutenção por equipamento:', error);
    res.status(500).json({ message: 'Erro ao obter frequência de manutenção por equipamento' });
  }
};
