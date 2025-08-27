import { NextRequest, NextResponse } from 'next/server';
import { predictShippingDemand } from '@/lib/ai-ml-utils';

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
    const prediction = await predictShippingDemand(
      origin,
      destination,
      { start: startDate, end: endDate }
    );

    // Add market insights
    const marketInsights = {
      growthTrend: prediction.predictedVolume > 50 ? 'Growing' : 'Stable',
      competitiveIntensity: calculateCompetitiveIntensity(origin, destination),
      recommendedAction: generateRecommendation(prediction),
      confidenceLevel: prediction.confidence > 0.8 ? 'High' : prediction.confidence > 0.6 ? 'Medium' : 'Low'
    };

    return NextResponse.json({
      success: true,
      prediction,
      marketInsights,
      metadata: {
        model: 'Time Series Forecasting with Seasonal Decomposition',
        dataPoints: 'Historical booking data from last 12 months',
        processedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Demand prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict demand. Please try again.' },
      { status: 500 }
    );
  }
}

function calculateCompetitiveIntensity(origin: string, destination: string): 'Low' | 'Medium' | 'High' {
  // Simplified competitive analysis based on route popularity
  const popularRoutes = [
    'mumbai-delhi', 'bangalore-mumbai', 'delhi-kolkata', 
    'chennai-bangalore', 'pune-mumbai', 'hyderabad-bangalore'
  ];
  
  const routeKey = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
  
  if (popularRoutes.some(route => routeKey.includes(route.split('-')[0]) && routeKey.includes(route.split('-')[1]))) {
    return 'High';
  } else if (origin.toLowerCase().includes('mumbai') || destination.toLowerCase().includes('delhi')) {
    return 'Medium';
  }
  
  return 'Low';
}

function generateRecommendation(prediction: any): string {
  if (prediction.confidence > 0.8 && prediction.predictedVolume > 100) {
    return 'High demand predicted - consider increasing courier capacity and competitive pricing';
  } else if (prediction.confidence > 0.6 && prediction.predictedVolume > 50) {
    return 'Moderate demand expected - maintain current service levels with slight capacity increase';
  } else if (prediction.predictedVolume < 20) {
    return 'Low demand forecasted - focus on cost optimization and efficiency improvements';
  }
  
  return 'Stable demand pattern - continue current operational strategy';
}
