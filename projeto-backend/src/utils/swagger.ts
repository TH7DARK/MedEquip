import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opções do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Sistema de Gerenciamento de Equipamentos Médicos',
      version: '1.0.0',
      description: 'Documentação da API para o Sistema de Gerenciamento de Equipamentos Médicos',
      contact: {
        name: 'Suporte',
        email: 'suporte@equipamentosmedicos.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com anotações JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Função para configurar o Swagger
export const setupSwagger = (app: express.Application) => {
  // Rota para a documentação do Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota para o JSON do Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Documentação Swagger disponível em /api-docs');
};
