import { NextRequest, NextResponse } from 'next/server';
// AI disabled in mock mode

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { route, packageDetails, courierPartner, externalFactors } = body;

    // Validate input
    if (!route || !packageDetails || !courierPartner) {
      return NextResponse.json(
        { error: 'Route, package details, and courier partner are required.' },
        { status: 400 }
      );
    }

    // Default external factors if not provided
    const defaultExternalFactors = {
      weather: 'clear',
      traffic: 0.3, // 0 = no traffic, 1 = heavy traffic
      dayOfWeek: new Date().getDay(),
      isHoliday: false,
      ...externalFactors
    };

    // Predict delivery time using AI
  return NextResponse.json({ success: true, prediction: { disabled: true }, message: 'AI disabled in mock mode' });
  } catch (error) {
    console.error('Delivery prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict delivery time. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper functions removed in mock mode
