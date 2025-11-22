import { NextRequest, NextResponse } from 'next/server';
// AI logic disabled in mock mode

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
  return NextResponse.json({ success: true, optimization: { disabled: true }, message: 'AI disabled in mock mode' });
  } catch (error) {
    console.error('Route optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize route. Please try again.' },
      { status: 500 }
    );
  }
}
