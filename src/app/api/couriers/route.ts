import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface CourierService {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedDays: string;
  rating: number;
  features: string[];
}

// Calculate distance-based pricing (simplified)
function calculatePrice(basePrice: number, pricePerKg: number, weight: number, distance: number = 500): number {
  const distanceMultiplier = Math.max(1, distance / 500); // Base 500km
  return Math.round((basePrice + (pricePerKg * weight)) * distanceMultiplier);
}

// Calculate estimated delivery days based on distance
function calculateDeliveryDays(distance: number = 500): string {
  if (distance <= 100) return '1-2 days';
  if (distance <= 500) return '2-3 days';
  if (distance <= 1000) return '3-5 days';
  return '5-7 days';
}

// Get features based on courier partner
function getCourierFeatures(name: string): string[] {
  const featureMap: Record<string, string[]> = {
    'Delhivery': ['Express', 'COD', 'Insurance'],
    'Shadowfax': ['Same Day', 'Express', 'Real-time tracking'],
    'Ekart': ['Reliable', 'COD', 'Pan India'],
    'BlueDart': ['Premium', 'International', 'Express'],
    'DTDC': ['Affordable', 'COD', 'Express'],
  };
  return featureMap[name] || ['Standard', 'Tracking'];
}

// Get rating based on courier partner
function getCourierRating(name: string): number {
  const ratingMap: Record<string, number> = {
    'Delhivery': 4.2,
    'Shadowfax': 4.1,
    'Ekart': 3.9,
    'BlueDart': 4.5,
    'DTDC': 3.8,
  };
  return ratingMap[name] || 4.0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const weight = searchParams.get('weight');

    // Get courier partners from database
    const courierPartners = await prisma.courierPartner.findMany({
      select: {
        id: true,
        name: true,
        basePrice: true,
        rating: true,
        estimatedDeliveryDays: true,
        features: true,
        contactPhone: true,
      }
    });

    // Simulate price calculation based on parameters
    const calculatePrice = (basePrice: number, weight: number) => {
      const weightMultiplier = Math.max(1, weight / 2);
      const distanceMultiplier = 1.2; // Mock distance factor
      return Math.round(basePrice * weightMultiplier * distanceMultiplier);
    };

    const weightNum = weight ? parseFloat(weight) : 1;

    const servicesWithPricing = courierPartners.map((service: any) => ({
      ...service,
      price: calculatePrice(service.basePrice, weightNum),
      route: `${from} → ${to}`,
    }));

    // Sort by price (lowest first)
    servicesWithPricing.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({
      success: true,
      data: servicesWithPricing,
      query: { from, to, weight: weightNum }
    });
  } catch (error) {
    console.error('Courier partners fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courier partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courierId, from, to, weight, senderDetails, receiverDetails } = body;

    // Validate courier partner exists
    const courierPartner = await prisma.courierPartner.findUnique({
      where: { id: courierId }
    });

    if (!courierPartner) {
      return NextResponse.json(
        { success: false, message: 'Courier partner not found' },
        { status: 404 }
      );
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        courierPartnerId: courierId,
        fromLocation: from,
        toLocation: to,
        weight: parseFloat(weight),
        status: 'PENDING',
        senderDetails: JSON.stringify(senderDetails),
        receiverDetails: JSON.stringify(receiverDetails),
      },
      include: {
        courierPartner: {
          select: {
            name: true,
            estimatedDeliveryDays: true
          }
        }
      }
    });

    // Calculate estimated delivery date
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + booking.courierPartner.estimatedDeliveryDays);

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      booking: {
        id: booking.id,
        courierId: booking.courierPartnerId,
        route: `${booking.fromLocation} → ${booking.toLocation}`,
        weight: booking.weight,
        status: booking.status,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
        trackingUrl: `/tracking?id=${booking.id}`,
        senderDetails: JSON.parse(booking.senderDetails),
        receiverDetails: JSON.parse(booking.receiverDetails),
        bookedAt: booking.createdAt.toISOString(),
        courierName: booking.courierPartner.name
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
