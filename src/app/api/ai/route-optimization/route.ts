import { NextRequest, NextResponse } from 'next/server';
import { optimizeMultiStopRoute } from '@/lib/ai-ml-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pickups, destination, constraints } = body;

    // Validate input
    if (!pickups || !destination || !Array.isArray(pickups)) {
      return NextResponse.json(
        { error: 'Invalid input. Pickups array and destination are required.' },
        { status: 400 }
      );
    }

    // Default constraints
    const defaultConstraints = {
      maxStops: 10,
      timeWindow: { start: '09:00', end: '18:00' },
      vehicleCapacity: 1000, // kg
      ...constraints
    };

    // Optimize route using AI
    const optimization = await optimizeMultiStopRoute(
      pickups,
      destination,
      defaultConstraints
    );

    return NextResponse.json({
      success: true,
      optimization,
      metadata: {
        algorithm: 'Enhanced TSP with Priority Weighting',
        processedAt: new Date().toISOString(),
        computationTime: Date.now() - Date.now(), // In real implementation, track actual time
      }
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize route. Please try again.' },
      { status: 500 }
    );
  }
}
