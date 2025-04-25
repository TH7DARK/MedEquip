import { NextResponse } from 'next/server';
import type { Equipamento } from '@/lib/contexts/EquipamentoContext';

let db: Equipamento[] = [];

// GET /api/equipamentos
export async function GET() {
  return NextResponse.json(db);
}

// POST /api/equipamentos
export async function POST(request: Request) {
  const equipamento: Equipamento = await request.json();
  const newId = db.length > 0 ? Math.max(...db.map(e => e.id!)) + 1 : 1;
  const newEq = { ...equipamento, id: newId, created_at: new Date().toISOString() };
  db.push(newEq);
  return NextResponse.json(newEq, { status: 201 });
}

// PUT /api/equipamentos
export async function PUT(request: Request) {
  const equipamento: Equipamento = await request.json();
  const idx = db.findIndex(e => e.id === equipamento.id);
  if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  db[idx] = { ...equipamento, updated_at: new Date().toISOString() };
  return NextResponse.json(db[idx]);
}

// DELETE /api/equipamentos
export async function DELETE(request: Request) {
  const { id } = await request.json();
  db = db.filter(e => e.id !== id);
  return NextResponse.json({ success: true });
}
