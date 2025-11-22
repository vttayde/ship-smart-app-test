import { NextRequest, NextResponse } from 'next/server';
// Payments disabled in mock mode

export async function POST(request: NextRequest) {
  try {
  return NextResponse.json({ success: true, mock: true, message: 'Payment verify disabled in mock mode' });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
