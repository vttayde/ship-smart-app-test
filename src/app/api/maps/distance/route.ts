import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance, geocodeAddress, calculateShippingCost, estimateDeliveryTime } from '@/lib/google-maps';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, weight } = body;

    if (!from || !to) {
      return NextResponse.json(
        { success: false, message: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    // Geocode addresses if they're strings
    let fromLocation = from;
    let toLocation = to;

    if (typeof from === 'string') {
      fromLocation = await geocodeAddress(from);
      if (!fromLocation) {
        return NextResponse.json(
          { success: false, message: 'Could not find origin location' },
          { status: 400 }
        );
      }
    }

    if (typeof to === 'string') {
      toLocation = await geocodeAddress(to);
      if (!toLocation) {
        return NextResponse.json(
          { success: false, message: 'Could not find destination location' },
          { status: 400 }
        );
      }
    }

    // Calculate distance and duration
    const distanceResult = await calculateDistance(fromLocation, toLocation);
    
    if (!distanceResult) {
      return NextResponse.json(
        { success: false, message: 'Could not calculate distance' },
        { status: 500 }
      );
    }

    const distanceKm = distanceResult.distance.value / 1000;
    const weightKg = weight || 1;

    // Calculate shipping cost and delivery time
    const shippingCost = calculateShippingCost(distanceKm, weightKg);
    const deliveryEstimate = estimateDeliveryTime(distanceKm);

    return NextResponse.json({
      success: true,
      data: {
        origin: fromLocation,
        destination: toLocation,
        distance: {
          text: distanceResult.distance.text,
          km: Math.round(distanceKm * 100) / 100,
          meters: distanceResult.distance.value,
        },
        duration: {
          text: distanceResult.duration.text,
          seconds: distanceResult.duration.value,
          minutes: Math.round(distanceResult.duration.value / 60),
        },
        pricing: {
          baseCost: shippingCost,
          weightKg: weightKg,
          costPerKm: Math.round((shippingCost / distanceKm) * 100) / 100,
        },
        delivery: {
          estimatedDays: deliveryEstimate.days,
          description: deliveryEstimate.description,
        },
      },
    });
  } catch (error) {
    console.error('Distance calculation API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
