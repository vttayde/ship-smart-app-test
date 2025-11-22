import { NextRequest, NextResponse } from 'next/server';
// Payments disabled in mock mode
interface CreateOrderData { amount: number; bookingId: string; userId: string; customerEmail?: string; customerPhone?: string; customerName?: string }

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderData = await request.json();
    const { amount, bookingId, userId, customerEmail, customerPhone, customerName } = body;

  return NextResponse.json({ success: true, mock: true, message: 'Payment order creation disabled in mock mode', amount, bookingId });

  } catch (error: any) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create payment order',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
