#!/bin/bash

# Script para inicialização do backend do Sistema de Gerenciamento de Equipamentos Médicos

echo "Iniciando configuração do backend..."

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    sudo service postgresql start
else
    echo "PostgreSQL já está instalado."
    sudo service postgresql start
fi

# Configurar banco de dados
echo "Configurando banco de dados..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" || true
sudo -u postgres psql -c "CREATE DATABASE equipamentos_medicos;" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE equipamentos_medicos TO postgres;" || true

# Navegar para o diretório do projeto
cd /home/ubuntu/projeto-backend

# Instalar dependências
echo "Instalando dependências..."
npm install

# Gerar Prisma Client
echo "Gerando Prisma Client..."
npx prisma generate

# Executar migrações
echo "Executando migrações do banco de dados..."
npx prisma migrate dev --name init

# Compilar o projeto
echo "Compilando o projeto..."
npm run build

echo "Configuração concluída com sucesso!"
echo "Para iniciar o servidor em modo de desenvolvimento, execute: npm run dev"
echo "Para iniciar o servidor em modo de produção, execute: npm start"
echo "A documentação da API estará disponível em: http://localhost:3001/api-docs"
