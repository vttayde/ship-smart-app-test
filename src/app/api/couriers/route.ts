import { NextRequest, NextResponse } from 'next/server';
// Prisma disabled in mock mode

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
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const weight = searchParams.get('weight');
  const weightNum = weight ? parseFloat(weight) : 1;
  return NextResponse.json({ success: true, data: [], query: { from, to, weight: weightNum }, message: 'Mock couriers list empty' });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Mock booking created', booking: { id: 'mock' } });
}
