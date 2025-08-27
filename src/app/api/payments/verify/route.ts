import { NextRequest, NextResponse } from 'next/server';
import { VerifyPaymentData } from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentData = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update payment status in database
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date()
      },
      include: {
        booking: {
          include: {
            courierPartner: true
          }
        }
      }
    });

    // Update booking status to CONFIRMED after successful payment
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { 
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        paidAt: payment.paidAt,
        booking: {
          id: payment.booking.id,
          status: payment.booking.status,
          courierPartner: payment.booking.courierPartner.name
        }
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
