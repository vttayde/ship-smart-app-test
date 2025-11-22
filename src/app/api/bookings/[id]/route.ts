import { NextRequest, NextResponse } from 'next/server';
// Prisma disabled in mock mode

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return NextResponse.json({ success: true, data: { id, mock: true } });
}

export async function PATCH(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return NextResponse.json({ success: true, message: 'Mock update ok', id });
}
