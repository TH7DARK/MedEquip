# Integração do Backend e Frontend

Este projeto utiliza uma arquitetura integrada com:

- **Frontend**: Next.js com React e TypeScript
- **Backend**: Node.js/Express com TypeScript e Prisma ORM
- **Banco de Dados**: Cloudflare D1 (SQLite na edge)

## Estrutura do Projeto

```
/MedEquip
  /src                  # Código-fonte do frontend (Next.js)
    /app                # Rotas e componentes de página
    /components         # Componentes React reutilizáveis
    /hooks              # React hooks personalizados
    /lib                # Utilitários e funções auxiliares
      api.ts            # Funções centralizadas para chamadas de API
  /backend              # Código-fonte do backend (Node.js/Express)
    /controllers        # Controladores para cada entidade
    /routes             # Definição de rotas da API
    /middlewares        # Middlewares (autenticação, validação)
    /prisma             # Configuração do Prisma ORM
    server.ts           # Ponto de entrada do backend
  .env.local            # Variáveis de ambiente para o frontend
  package.json          # Dependências do frontend
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm, yarn ou pnpm

### Configuração

1. **Instalar dependências do frontend:**

```bash
# Na raiz do projeto
npm install
# ou
yarn install
# ou
pnpm install
```

2. **Instalar dependências do backend:**

```bash
# Na pasta backend
cd backend
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurar variáveis de ambiente:**

Para o frontend, crie ou edite o arquivo `.env.local` na raiz do projeto:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Para o backend, crie ou edite o arquivo `.env` na pasta `backend`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu_jwt_secret_seguro"
PORT=3001
```

4. **Configurar o banco de dados:**

```bash
# Na pasta backend
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### Executar o Projeto

1. **Iniciar o backend:**

```bash
# Na pasta backend
cd backend
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O servidor backend estará disponível em `http://localhost:3001/api`.

2. **Iniciar o frontend:**

```bash
# Na raiz do projeto
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O frontend estará disponível em `http://localhost:3000`.

## Autenticação

O sistema utiliza autenticação JWT. Os usuários padrão criados pelo seed são:

- **Administrador**:
  - Email: admin@medequip.com
  - Senha: admin123

- **Técnico**:
  - Email: tecnico@medequip.com
  - Senha: tecnico123

## Documentação da API

A documentação completa da API está disponível no arquivo `backend/api-docs.md`.
