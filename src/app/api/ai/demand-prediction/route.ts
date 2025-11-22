import { NextRequest, NextResponse } from 'next/server';
// AI disabled in mock mode

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, timeframe } = body;

    // Validate input
    if (!origin || !destination || !timeframe) {
      return NextResponse.json(
        { error: 'Origin, destination, and timeframe are required.' },
        { status: 400 }
      );
    }

    // Validate timeframe
    const startDate = new Date(timeframe.start);
    const endDate = new Date(timeframe.end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format in timeframe.' },
        { status: 400 }
      );
    }

    // Predict demand using AI/ML
  return NextResponse.json({ success: true, prediction: { disabled: true }, message: 'AI disabled in mock mode' });
  } catch (error) {
    console.error('Demand prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict demand. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper functions removed in mock mode
