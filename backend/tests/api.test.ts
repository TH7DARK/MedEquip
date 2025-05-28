import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    equipamento: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    manutencao: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    alerta: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    categoria: {
      findMany: jest.fn(),
    },
    unidade: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
  verify: jest.fn(() => ({ id: 1, email: 'test@example.com' })),
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed-password'),
  compare: jest.fn(() => true),
}));

// Mock do serviço de IA
jest.mock('../services/iaService', () => ({
  buscarSolucoes: jest.fn(() => ({
    equipamento: { marca: 'Test', modelo: 'Model' },
    problema: 'Test problem',
    solucao: 'Test solution',
    dataConsulta: new Date().toISOString(),
  })),
  buscarInformacoesEquipamento: jest.fn(() => ({
    marca: 'Test',
    modelo: 'Model',
    descricao: 'Test description',
    especificacoes: 'Test specs',
    dataConsulta: new Date().toISOString(),
  })),
}));

// Importar o app após os mocks
import app from '../index';

describe('API Tests', () => {
  let prisma: any;
  let token: string;

  beforeAll(() => {
    prisma = new PrismaClient();
    token = 'Bearer mock-token';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Auth Routes', () => {
    test('POST /api/auth/register should register a new user', async () => {
      prisma.usuario.findUnique.mockResolvedValueOnce(null);
      prisma.usuario.create.mockResolvedValueOnce({
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashed-password',
        cargo: 'Técnico',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Test User',
          email: 'test@example.com',
          senha: 'password123',
          cargo: 'Técnico',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', 'Test User');
      expect(response.body).not.toHaveProperty('senha');
    });

    test('POST /api/auth/login should login a user', async () => {
      prisma.usuario.findUnique.mockResolvedValueOnce({
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashed-password',
        cargo: 'Técnico',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          senha: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).not.toHaveProperty('senha');
    });
  });

  describe('Equipamento Routes', () => {
    test('GET /api/equipamentos should return all equipamentos', async () => {
      prisma.equipamento.findMany.mockResolvedValueOnce([
        {
          id: 1,
          numeroSerie: 'SN123456',
          nome: 'Equipamento Teste',
          marca: 'Marca Teste',
          modelo: 'Modelo Teste',
          dataAquisicao: new Date(),
          status: 'Ativo',
          categoria: { id: 1, nome: 'Categoria Teste' },
          unidade: { id: 1, nome: 'Unidade Teste' },
        },
      ]);

      const response = await request(app)
        .get('/api/equipamentos')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('numeroSerie', 'SN123456');
    });

    // Adicione mais testes para outras rotas de equipamentos
  });

  describe('Manutencao Routes', () => {
    test('GET /api/manutencoes should return all manutencoes', async () => {
      prisma.manutencao.findMany.mockResolvedValueOnce([
        {
          id: 1,
          tipo: 'Preventiva',
          status: 'Concluída',
          dataRealizacao: new Date(),
          equipamento: {
            id: 1,
            nome: 'Equipamento Teste',
            categoria: { id: 1, nome: 'Categoria Teste' },
            unidade: { id: 1, nome: 'Unidade Teste' },
          },
          tecnicoResponsavel: {
            id: 1,
            nome: 'Técnico Teste',
            email: 'tecnico@teste.com',
            cargo: 'Técnico',
          },
        },
      ]);

      const response = await request(app)
        .get('/api/manutencoes')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('tipo', 'Preventiva');
    });

    // Adicione mais testes para outras rotas de manutenções
  });

  describe('Alerta Routes', () => {
    test('GET /api/alertas should return all alertas', async () => {
      prisma.alerta.findMany.mockResolvedValueOnce([
        {
          id: 1,
          dataAlerta: new Date(),
          status: 'Pendente',
          mensagem: 'Alerta de teste',
          equipamento: {
            id: 1,
            nome: 'Equipamento Teste',
            categoria: { id: 1, nome: 'Categoria Teste' },
            unidade: { id: 1, nome: 'Unidade Teste' },
          },
          manutencao: {
            id: 1,
            tecnicoResponsavel: {
              id: 1,
              nome: 'Técnico Teste',
              email: 'tecnico@teste.com',
              cargo: 'Técnico',
            },
          },
        },
      ]);

      const response = await request(app)
        .get('/api/alertas')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('status', 'Pendente');
    });

    // Adicione mais testes para outras rotas de alertas
  });

  describe('Dashboard Routes', () => {
    test('GET /api/dashboard should return dashboard data', async () => {
      prisma.equipamento.groupBy.mockResolvedValueOnce([
        { status: 'Ativo', _count: { id: 5 } },
        { status: 'Em manutenção', _count: { id: 2 } },
      ]);

      prisma.categoria.findMany.mockResolvedValueOnce([
        { id: 1, nome: 'Categoria 1', _count: { equipamentos: 3 } },
        { id: 2, nome: 'Categoria 2', _count: { equipamentos: 4 } },
      ]);

      prisma.unidade.findMany.mockResolvedValueOnce([
        { id: 1, nome: 'Unidade 1', _count: { equipamentos: 2 } },
        { id: 2, nome: 'Unidade 2', _count: { equipamentos: 5 } },
      ]);

      prisma.manutencao.findMany.mockResolvedValueOnce([
        {
          id: 1,
          tipo: 'Preventiva',
          dataRealizacao: new Date(),
          equipamento: { nome: 'Equipamento 1', categoria: {}, unidade: {} },
          tecnicoResponsavel: { nome: 'Técnico 1' },
        },
      ]);

      prisma.$queryRaw.mockResolvedValueOnce([
        { mes: new Date(), total: 1000 },
        { mes: new Date(), total: 1500 },
      ]);

      prisma.equipamento.findMany.mockResolvedValueOnce([
        {
          id: 1,
          nome: 'Equipamento 1',
          marca: 'Marca 1',
          modelo: 'Modelo 1',
          status: 'Ativo',
          _count: { manutencoes: 5 },
          categoria: {},
          unidade: {},
        },
      ]);

      prisma.alerta.count.mockResolvedValueOnce(3);

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('equipamentosPorStatus');
      expect(response.body).toHaveProperty('equipamentosPorCategoria');
      expect(response.body).toHaveProperty('equipamentosPorUnidade');
      expect(response.body).toHaveProperty('manutencoesRecentes');
      expect(response.body).toHaveProperty('custosPorMes');
      expect(response.body).toHaveProperty('equipamentosMaisManutencao');
      expect(response.body).toHaveProperty('alertasPendentes');
    });
  });

  describe('IA Routes', () => {
    test('POST /api/ia/solucoes should return solutions for a problem', async () => {
      const response = await request(app)
        .post('/api/ia/solucoes')
        .set('Authorization', token)
        .send({
          marca: 'Test',
          modelo: 'Model',
          problema: 'Test problem',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('solucao');
      expect(response.body).toHaveProperty('equipamento');
      expect(response.body).toHaveProperty('problema', 'Test problem');
    });

    test('POST /api/ia/informacoes-equipamento should return equipment information', async () => {
      const response = await request(app)
        .post('/api/ia/informacoes-equipamento')
        .set('Authorization', token)
        .send({
          marca: 'Test',
          modelo: 'Model',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('marca', 'Test');
      expect(response.body).toHaveProperty('modelo', 'Model');
    });
  });
});
