# Backend do Sistema de Equipamentos Médicos

Este é o backend do Sistema de Equipamentos Médicos, desenvolvido com Node.js, Express, TypeScript e MongoDB.

## Requisitos

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
2. Navegue até a pasta do backend:
```bash
cd backend
```

3. Instale as dependências:
```bash
npm install
```

4. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/sistema-equipamentos-medicos
JWT_SECRET=sua_chave_secreta_jwt
NODE_ENV=development
```

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
npm start
```

## Endpoints da API

### Equipamentos

- `GET /api/equipamentos` - Lista todos os equipamentos
- `GET /api/equipamentos/:id` - Busca um equipamento específico
- `POST /api/equipamentos` - Cria um novo equipamento
- `PUT /api/equipamentos/:id` - Atualiza um equipamento
- `DELETE /api/equipamentos/:id` - Remove um equipamento
- `GET /api/equipamentos/status/:status` - Busca equipamentos por status

## Estrutura do Projeto

```
src/
  ├── controllers/     # Controladores da aplicação
  ├── models/         # Modelos do MongoDB
  ├── routes/         # Rotas da API
  ├── middlewares/    # Middlewares
  ├── config/         # Configurações
  ├── services/       # Serviços
  └── server.ts       # Arquivo principal
```

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Cors
- Dotenv 