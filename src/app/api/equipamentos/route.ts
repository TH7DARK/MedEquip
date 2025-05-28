// Este arquivo foi substituído pela implementação real do backend
// As rotas de API agora são servidas pelo backend em http://localhost:3001/api
// Veja src/lib/api.ts para as funções de chamada à API

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "Esta API simulada foi desativada. Use o backend real em http://localhost:3001/api/equipment" 
  }, { status: 308 });
}

export async function POST() {
  return NextResponse.json({ 
    message: "Esta API simulada foi desativada. Use o backend real em http://localhost:3001/api/equipment" 
  }, { status: 308 });
}

export async function PUT() {
  return NextResponse.json({ 
    message: "Esta API simulada foi desativada. Use o backend real em http://localhost:3001/api/equipment" 
  }, { status: 308 });
}

export async function DELETE() {
  return NextResponse.json({ 
    message: "Esta API simulada foi desativada. Use o backend real em http://localhost:3001/api/equipment" 
  }, { status: 308 });
}
