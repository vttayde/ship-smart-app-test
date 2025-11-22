import { NextRequest, NextResponse } from 'next/server';
// AI disabled in mock mode

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { route, packageDetails, marketConditions } = body;

    // Validate input
    if (!route || !packageDetails) {
      return NextResponse.json(
        { error: 'Route and package details are required.' },
        { status: 400 }
      );
    }

    // Default market conditions if not provided
    const defaultMarketConditions = {
      demand: 0.5, // 0 = low, 1 = high
      competition: 0.5,
      seasonality: 0.5,
      ...marketConditions
    };

    // Optimize pricing using AI
  return NextResponse.json({ success: true, pricing: { disabled: true }, message: 'AI disabled in mock mode' });
  } catch (error) {
    console.error('Pricing optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize pricing. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper functions removed in mock mode
