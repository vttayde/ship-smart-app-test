// NextAuth disabled in mock mode
import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ disabled: true }, { status: 501 }); }
export function POST() { return NextResponse.json({ disabled: true }, { status: 501 }); }
