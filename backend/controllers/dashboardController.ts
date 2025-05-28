import { Request, Response } from 'express';
import { prisma } from '../index';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Obter contagem de equipamentos por status
    const equipamentosPorStatus = await prisma.equipamento.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Obter contagem de equipamentos por categoria
    const equipamentosPorCategoria = await prisma.categoria.findMany({
      select: {
        id: true,
        nome: true,
        _count: {
          select: {
            equipamentos: true
          }
        }
      }
    });

    // Obter contagem de equipamentos por unidade
    const equipamentosPorUnidade = await prisma.unidade.findMany({
      select: {
        id: true,
        nome: true,
        _count: {
          select: {
            equipamentos: true
          }
        }
      }
    });

    // Obter manutenções recentes (últimos 30 dias)
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - 30);
    
    const manutencoesRecentes = await prisma.manutencao.findMany({
      where: {
        dataRealizacao: {
          gte: dataInicio
        }
      },
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
      },
      take: 10
    });

    // Obter total de custos de manutenção por mês (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
    
    const custosPorMes = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "dataRealizacao") as mes,
        SUM(custo) as total
      FROM "Manutencao"
      WHERE "dataRealizacao" >= ${seisMesesAtras}
      GROUP BY DATE_TRUNC('month', "dataRealizacao")
      ORDER BY mes ASC
    `;

    // Obter equipamentos que mais necessitam de manutenção (com mais manutenções)
    const equipamentosMaisManutencao = await prisma.equipamento.findMany({
      select: {
        id: true,
        nome: true,
        marca: true,
        modelo: true,
        status: true,
        _count: {
          select: {
            manutencoes: true
          }
        },
        categoria: true,
        unidade: true
      },
      orderBy: {
        manutencoes: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Obter alertas pendentes
    const alertasPendentes = await prisma.alerta.count({
      where: {
        status: 'Pendente'
      }
    });

    // Retornar todos os dados do dashboard
    return res.json({
      equipamentosPorStatus,
      equipamentosPorCategoria,
      equipamentosPorUnidade,
      manutencoesRecentes,
      custosPorMes,
      equipamentosMaisManutencao,
      alertasPendentes
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
};
