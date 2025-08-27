import { NextRequest, NextResponse } from 'next/server';
import { razorpay, CreateOrderData } from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderData = await request.json();
    const { amount, bookingId, userId, customerEmail, customerPhone, customerName } = body;

    // Validate booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId
      },
      include: {
        courierPartner: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists for this booking
    const existingPayment = await prisma.payment.findFirst({
      where: {
        bookingId: bookingId,
        status: { in: ['PENDING', 'SUCCESS'] }
      }
    });

    if (existingPayment) {
      return NextResponse.json(
        { success: false, message: 'Payment already exists for this booking' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId,
        userId,
        customerEmail,
        courierPartner: booking.courierPartner.name
      }
    });

    // Save payment record in database
    const payment = await prisma.payment.create({
      data: {
        id: order.id,
        bookingId: bookingId,
        amount: amount / 100, // store in rupees
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: order.id,
        customerEmail,
        customerPhone,
        customerName
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      payment: {
        id: payment.id,
        status: payment.status
      }
    });

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
