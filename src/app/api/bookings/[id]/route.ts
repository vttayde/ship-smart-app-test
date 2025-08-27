import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    // Fetch booking from database
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        courierPartner: {
          select: {
            name: true,
            contactPhone: true,
            estimatedDeliveryDays: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Calculate estimated delivery date
    const estimatedDelivery = new Date(booking.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + booking.courierPartner.estimatedDeliveryDays);

    // Mock tracking timeline based on booking status
    const getTrackingTimeline = (status: string, createdAt: Date) => {
      const timeline = [
        {
          status: 'Order Placed',
          date: createdAt.toISOString(),
          completed: true,
          description: 'Your booking has been confirmed'
        }
      ];

      if (status !== 'PENDING') {
        timeline.push({
          status: 'Package Collected',
          date: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          description: 'Package picked up from sender'
        });
      }

      if (status === 'IN_TRANSIT' || status === 'DELIVERED') {
        timeline.push({
          status: 'In Transit',
          date: new Date(createdAt.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          completed: status === 'IN_TRANSIT' || status === 'DELIVERED',
          description: 'Package is on the way'
        });
      }

      if (status === 'DELIVERED') {
        timeline.push({
          status: 'Delivered',
          date: estimatedDelivery.toISOString(),
          completed: true,
          description: 'Package delivered successfully'
        });
      } else {
        timeline.push({
          status: 'Out for Delivery',
          date: estimatedDelivery.toISOString(),
          completed: false,
          description: 'Package will be delivered soon'
        });
      }

      return timeline;
    };

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        status: booking.status,
        route: `${booking.fromLocation} → ${booking.toLocation}`,
        weight: booking.weight,
        courierPartner: booking.courierPartner.name,
        contactPhone: booking.courierPartner.contactPhone,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
        senderDetails: JSON.parse(booking.senderDetails),
        receiverDetails: JSON.parse(booking.receiverDetails),
        bookedAt: booking.createdAt.toISOString(),
        trackingTimeline: getTrackingTimeline(booking.status, booking.createdAt)
      }
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    const { status } = body;

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        courierPartner: {
          select: {
            name: true,
            estimatedDeliveryDays: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        courierPartner: updatedBooking.courierPartner.name
      }
    });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
