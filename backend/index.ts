import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { iniciarAgendadorAlertas } from './utils/agendadorAlertas';
import { setupSwagger } from './utils/swagger';

// Importação das rotas
import authRoutes from './routes/authRoutes';
import equipamentoRoutes from './routes/equipamentoRoutes';
import manutencaoRoutes from './routes/manutencaoRoutes';
import alertaRoutes from './routes/alertaRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import notificacaoRoutes from './routes/notificacaoRoutes';
import iaRoutes from './routes/iaRoutes';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Prisma Client
export const prisma = new PrismaClient();

// Inicializa o Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Swagger
setupSwagger(app);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/equipamentos', equipamentoRoutes);
app.use('/api/manutencoes', manutencaoRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/ia', iaRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Gerenciamento de Equipamentos Médicos' });
});

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializa o servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    
    // Inicia o agendador de alertas
    iniciarAgendadorAlertas();
  });
}

// Tratamento de erros do Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;
