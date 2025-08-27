import { NextRequest, NextResponse } from 'next/server';
import { optimizePricing } from '@/lib/ai-ml-utils';

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
    const pricingOptimization = await optimizePricing(
      route,
      packageDetails,
      defaultMarketConditions
    );

    // Add pricing insights
    const insights = {
      priceRange: {
        minimum: Math.round(pricingOptimization.suggestedPrice * 0.85),
        maximum: Math.round(pricingOptimization.suggestedPrice * 1.15),
        recommended: pricingOptimization.suggestedPrice
      },
      marketPosition: getMarketPosition(pricingOptimization.competitorAnalysis, pricingOptimization.suggestedPrice),
      revenueImpact: calculateRevenueImpact(pricingOptimization),
      recommendations: generatePricingRecommendations(pricingOptimization, defaultMarketConditions)
    };

    return NextResponse.json({
      success: true,
      pricing: pricingOptimization,
      insights,
      metadata: {
        model: 'Dynamic Pricing Algorithm with Market Intelligence',
        factors: ['Distance', 'Weight', 'Demand', 'Competition', 'Seasonality'],
        processedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Pricing optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize pricing. Please try again.' },
      { status: 500 }
    );
  }
}

function getMarketPosition(competitors: Array<{ courier: string; price: number }>, suggestedPrice: number): string {
  const prices = competitors.map(c => c.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  
  if (suggestedPrice < prices[0]) {
    return 'Market Leader (Lowest Price)';
  } else if (suggestedPrice <= median) {
    return 'Competitive (Below Market Average)';
  } else if (suggestedPrice <= prices[prices.length - 1]) {
    return 'Premium (Above Market Average)';
  } else {
    return 'Luxury (Highest Price)';
  }
}

function calculateRevenueImpact(pricing: any): { projected: number; variance: string } {
  const baseRevenue = pricing.suggestedPrice * 100; // Assume 100 bookings
  const variance = pricing.demandMultiplier > 1 ? '+15%' : pricing.demandMultiplier < 0.9 ? '-10%' : '±5%';
  
  return {
    projected: Math.round(baseRevenue),
    variance
  };
}

function generatePricingRecommendations(pricing: any, marketConditions: any): string[] {
  const recommendations = [];
  
  if (pricing.demandMultiplier > 1.1) {
    recommendations.push('High demand detected - consider premium pricing strategy');
  }
  
  if (pricing.profitMargin < 15) {
    recommendations.push('Low profit margin - review cost structure or increase pricing');
  }
  
  if (marketConditions.competition > 0.7) {
    recommendations.push('High competition - focus on value proposition and service quality');
  }
  
  if (marketConditions.seasonality > 0.8) {
    recommendations.push('Peak season pricing - maximize revenue with demand-based pricing');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Optimal pricing detected - maintain current strategy');
  }
  
  return recommendations;
}
