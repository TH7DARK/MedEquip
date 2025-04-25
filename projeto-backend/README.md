# Documentação do Backend para Sistema de Equipamentos Médicos

## Visão Geral

Este documento descreve a implementação do backend para o Sistema de Gerenciamento de Equipamentos Médicos, desenvolvido com Node.js, Express, TypeScript e PostgreSQL.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **Prisma ORM**: ORM (Object-Relational Mapping) para acesso ao banco de dados
- **JWT**: Autenticação baseada em tokens
- **OpenAI API**: Integração para funcionalidades de IA
- **Telegram/WhatsApp API**: Integração para sistema de alertas
- **Jest**: Framework de testes
- **Swagger**: Documentação da API

## Estrutura do Projeto

```
projeto-backend/
├── prisma/
│   ├── schema.prisma    # Esquema do banco de dados
│   └── migrations/      # Migrações do banco de dados
├── src/
│   ├── controllers/     # Controladores da API
│   ├── middlewares/     # Middlewares (autenticação, tratamento de erros)
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços (IA, alertas)
│   ├── utils/           # Utilitários
│   ├── tests/           # Testes automatizados
│   └── index.ts         # Ponto de entrada da aplicação
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## Modelos de Dados

O sistema utiliza os seguintes modelos de dados:

1. **Usuario**: Armazena informações dos usuários do sistema
2. **Unidade**: Representa as unidades onde os equipamentos estão localizados
3. **Categoria**: Categorias de equipamentos médicos
4. **Equipamento**: Informações detalhadas sobre os equipamentos médicos
5. **Manutencao**: Registros de manutenções preventivas e corretivas
6. **Alerta**: Sistema de alertas para manutenções programadas

## Endpoints da API

### Autenticação

- `POST /api/auth/register`: Registra um novo usuário
- `POST /api/auth/login`: Autentica um usuário e retorna um token JWT
- `GET /api/auth/profile`: Retorna o perfil do usuário autenticado

### Equipamentos

- `GET /api/equipamentos`: Lista todos os equipamentos
- `GET /api/equipamentos/:id`: Retorna detalhes de um equipamento específico
- `POST /api/equipamentos`: Cadastra um novo equipamento
- `PUT /api/equipamentos/:id`: Atualiza informações de um equipamento
- `DELETE /api/equipamentos/:id`: Remove um equipamento

### Manutenções

- `GET /api/manutencoes`: Lista todas as manutenções
- `GET /api/manutencoes/:id`: Retorna detalhes de uma manutenção específica
- `POST /api/manutencoes`: Registra uma nova manutenção
- `PUT /api/manutencoes/:id`: Atualiza informações de uma manutenção
- `DELETE /api/manutencoes/:id`: Remove uma manutenção

### Alertas

- `GET /api/alertas`: Lista todos os alertas
- `GET /api/alertas/pendentes`: Lista alertas pendentes
- `GET /api/alertas/:id`: Retorna detalhes de um alerta específico
- `POST /api/alertas`: Cria um novo alerta
- `PUT /api/alertas/:id`: Atualiza informações de um alerta
- `DELETE /api/alertas/:id`: Remove um alerta

### Dashboard

- `GET /api/dashboard`: Retorna dados estatísticos para o dashboard

### Notificações

- `POST /api/notificacoes/enviar`: Aciona o envio de alertas manualmente

### IA

- `POST /api/ia/solucoes`: Busca soluções para problemas de equipamentos
- `POST /api/ia/informacoes-equipamento`: Busca informações sobre equipamentos

## Funcionalidades Principais

### Sistema de Alertas

O sistema inclui um mecanismo de alertas para manutenções preventivas programadas:

- Alertas são criados automaticamente quando uma próxima manutenção é agendada
- Um agendador verifica diariamente os alertas pendentes para o dia seguinte
- Notificações são enviadas via Telegram e WhatsApp com 1 dia de antecedência

### Funcionalidade de IA

O sistema utiliza a OpenAI API para:

- Buscar soluções para problemas relatados em equipamentos
- Obter informações detalhadas sobre equipamentos médicos (descrição, especificações, manuais)

## Configuração e Execução

### Requisitos

- Node.js 14+
- PostgreSQL 12+

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/equipamentos_medicos?schema=public"
JWT_SECRET="seu_segredo_jwt"
PORT=3001
NODE_ENV="development"
OPENAI_API_KEY="sua_chave_api_openai"
TELEGRAM_BOT_TOKEN="seu_token_bot_telegram"
WHATSAPP_API_KEY="sua_chave_api_whatsapp"
```

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações do banco de dados
npm run prisma:migrate

# Compilar o projeto
npm run build
```

### Execução

```bash
# Ambiente de desenvolvimento
npm run dev

# Ambiente de produção
npm start
```

### Testes

```bash
# Executar testes
npm test
```

## Documentação da API

A documentação completa da API está disponível em:

```
http://localhost:3001/api-docs
```

## Próximos Passos

- Implementar sistema de logs detalhados
- Adicionar mais relatórios e estatísticas
- Expandir funcionalidades de IA para análise preditiva de falhas
- Implementar sistema de backup automático do banco de dados
