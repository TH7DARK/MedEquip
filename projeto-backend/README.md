# Instruções de Uso - Backend do Sistema de Gerenciamento de Equipamentos Médicos

Este documento contém instruções para configurar, executar e integrar o backend do Sistema de Gerenciamento de Equipamentos Médicos com o frontend existente.

## Requisitos

- Node.js (versão 16 ou superior)
- npm ou pnpm
- SQLite (para desenvolvimento local) ou Cloudflare D1 (para produção)

## Estrutura do Projeto

O backend foi desenvolvido com a seguinte estrutura:

```
/backend
  /src
    /controllers     # Controladores para cada entidade
    /models          # Modelos de dados e interfaces
    /routes          # Definição de rotas da API
    /services        # Lógica de negócios
    /middlewares     # Middlewares (autenticação, validação)
    /utils           # Funções utilitárias
    /config          # Configurações do sistema
    /prisma          # Configuração do Prisma ORM
      schema.prisma  # Schema do banco de dados
      seed.ts        # Dados iniciais para o banco
    server.ts        # Ponto de entrada da aplicação
  package.json       # Dependências do backend
  tsconfig.json      # Configuração do TypeScript
  .env              # Variáveis de ambiente (não versionado)
  .env.example      # Exemplo de variáveis de ambiente
  api-docs.md        # Documentação da API
```

## Configuração Inicial

1. Instale as dependências:

```bash
cd backend
npm install
# ou
pnpm install
```

2. Configure as variáveis de ambiente:

```bash
cp src/.env.example .env
```

3. Edite o arquivo `.env` com suas configurações:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu_jwt_secret_seguro"
PORT=3001
```

4. Gere o cliente Prisma:

```bash
npx prisma generate
```

5. Crie o banco de dados e execute as migrações:

```bash
npx prisma migrate dev --name init
```

6. Execute o seed para criar dados iniciais:

```bash
npx ts-node src/prisma/seed.ts
```

## Execução do Backend

### Ambiente de Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

O servidor será iniciado na porta 3001 (ou na porta definida no arquivo .env).

### Ambiente de Produção

1. Compile o código TypeScript:

```bash
npm run build
# ou
pnpm build
```

2. Execute o servidor:

```bash
npm start
# ou
pnpm start
```

## Integração com o Frontend

Para integrar o backend com o frontend Next.js existente, siga estas etapas:

1. Configure o frontend para acessar a API:

   Crie ou edite um arquivo de configuração no frontend (por exemplo, `src/config/api.ts`):

   ```typescript
   export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
   ```

2. Crie serviços para consumir a API:

   Exemplo de serviço para equipamentos:

   ```typescript
   // src/services/equipment.service.ts
   import { API_URL } from '../config/api';

   export const getEquipments = async (token: string) => {
     const response = await fetch(`${API_URL}/equipment`, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     return response.json();
   };

   export const getEquipmentById = async (id: number, token: string) => {
     const response = await fetch(`${API_URL}/equipment/${id}`, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     return response.json();
   };

   // Adicione outros métodos conforme necessário
   ```

3. Utilize os serviços nos componentes do frontend:

   ```typescript
   import { useEffect, useState } from 'react';
   import { getEquipments } from '../services/equipment.service';

   const EquipmentList = () => {
     const [equipments, setEquipments] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     
     // Obter token do armazenamento local ou contexto de autenticação
     const token = localStorage.getItem('token');

     useEffect(() => {
       const fetchEquipments = async () => {
         try {
           const data = await getEquipments(token);
           setEquipments(data);
         } catch (err) {
           setError(err.message);
         } finally {
           setLoading(false);
         }
       };

       fetchEquipments();
     }, [token]);

     // Renderização do componente
   };
   ```

## Integração com Cloudflare D1

Para utilizar o Cloudflare D1 em produção:

1. Configure o Wrangler para usar o D1:

   Edite o arquivo `wrangler.toml` para incluir a configuração do D1:

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "equipamentos_medicos_db"
   database_id = "seu_database_id"
   ```

2. Adapte o Prisma para usar o D1:

   Modifique o arquivo `schema.prisma` para usar o adaptador do D1:

   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Execute as migrações no D1:

   ```bash
   wrangler d1 execute equipamentos_medicos_db --file ./prisma/migrations/migration.sql
   ```

## Usuários Padrão

O seed cria dois usuários padrão para testes:

1. Administrador:
   - Email: admin@medequip.com
   - Senha: admin123

2. Técnico:
   - Email: tecnico@medequip.com
   - Senha: tecnico123

## Documentação da API

A documentação completa da API está disponível no arquivo `api-docs.md`.

## Suporte e Manutenção

Para suporte ou dúvidas sobre o backend, entre em contato com a equipe de desenvolvimento.

---

Este backend foi desenvolvido para atender às necessidades do Sistema de Gerenciamento de Equipamentos Médicos, fornecendo uma API robusta e segura para o frontend existente.
