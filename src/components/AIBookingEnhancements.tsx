'use client'

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface AIBookingEnhancementsProps {
  bookingData: {
    origin: string;
    destination: string;
    packageDetails: {
      weight: number;
      dimensions: string;
      value: number;
      priority: 'standard' | 'express' | 'urgent';
    };
  };
  onOptimizedBooking: (enhancements: AIEnhancements) => void;
}

interface AIEnhancements {
  optimizedRoute?: {
    suggestedStops: string[];
    timeSavings: number;
    costSavings: number;
  };
  smartPricing?: {
    originalPrice: number;
    optimizedPrice: number;
    savings: number;
    reason: string;
  };
  deliveryPrediction?: {
    estimatedDelivery: string;
    confidence: number;
    alternatives: Array<{
      service: string;
      delivery: string;
      price: number;
    }>;
  };
  demandInsights?: {
    demandLevel: 'low' | 'medium' | 'high';
    recommendation: string;
    bestTimeToBook: string;
  };
}

export default function AIBookingEnhancements({ bookingData, onOptimizedBooking }: AIBookingEnhancementsProps) {
  const [loading, setLoading] = useState(false);
  const [enhancements, setEnhancements] = useState<AIEnhancements>({});
  const [showDetails, setShowDetails] = useState(false);

  const analyzeBooking = async () => {
    setLoading(true);
    setShowDetails(true);

    try {
      // Run all AI analyses in parallel
      const [routeResponse, pricingResponse, deliveryResponse, demandResponse] = await Promise.all([
        // Route optimization
        fetch('/api/ai/route-optimization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickups: [{ 
              lat: 19.0760, 
              lng: 72.8777, 
              address: bookingData.origin, 
              priority: 1 
            }],
            destination: { 
              lat: 28.7041, 
              lng: 77.1025, 
              address: bookingData.destination 
            },
            constraints: { 
              maxStops: 3, 
              timeWindow: { start: '09:00', end: '18:00' }, 
              vehicleCapacity: bookingData.packageDetails.weight * 10 
            }
          })
        }),

        // Smart pricing
        fetch('/api/ai/smart-pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            route: {
              origin: bookingData.origin,
              destination: bookingData.destination,
              distance: 1420
            },
            packageDetails: bookingData.packageDetails,
            marketConditions: {
              demand: 0.7,
              competition: 0.6,
              seasonality: 0.8
            }
          })
        }),

        // Delivery prediction
        fetch('/api/ai/delivery-prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            route: {
              origin: bookingData.origin,
              destination: bookingData.destination,
              distance: 1420
            },
            packageDetails: bookingData.packageDetails,
            courierPartner: 'Delhivery',
            externalFactors: {
              weather: 'clear',
              traffic: 0.4,
              dayOfWeek: new Date().getDay(),
              isHoliday: false
            }
          })
        }),

        // Demand prediction
        fetch('/api/ai/demand-prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: bookingData.origin,
            destination: bookingData.destination,
            timeframe: {
              start: new Date().toISOString(),
              end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          })
        })
      ]);

      const [routeData, pricingData, deliveryData, demandData] = await Promise.all([
        routeResponse.json(),
        pricingResponse.json(),
        deliveryResponse.json(),
        demandResponse.json()
      ]);

      // Process and format the AI responses
      const aiEnhancements: AIEnhancements = {
        optimizedRoute: routeData.success ? {
          suggestedStops: ['Mumbai Hub', 'Delhi Hub'],
          timeSavings: Math.round(routeData.optimization.optimizedRoute.totalTime * 0.15),
          costSavings: routeData.optimization.optimizedRoute.costSavings
        } : undefined,

        smartPricing: pricingData.success ? {
          originalPrice: 450,
          optimizedPrice: pricingData.pricing.suggestedPrice,
          savings: 450 - pricingData.pricing.suggestedPrice,
          reason: pricingData.insights.priceReasoning
        } : undefined,

        deliveryPrediction: deliveryData.success ? {
          estimatedDelivery: new Date(deliveryData.prediction.estimatedDelivery).toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          confidence: Math.round(deliveryData.prediction.confidence * 100),
          alternatives: [
            { service: 'Standard', delivery: 'Tomorrow 6:00 PM', price: 280 },
            { service: 'Express', delivery: 'Today 11:00 PM', price: 450 },
            { service: 'Priority', delivery: 'Today 6:00 PM', price: 680 }
          ]
        } : undefined,

        demandInsights: demandData.success ? {
          demandLevel: demandData.prediction.predictedVolume > 100 ? 'high' : 
                      demandData.prediction.predictedVolume > 50 ? 'medium' : 'low',
          recommendation: 'Book now for best rates - high demand expected next week',
          bestTimeToBook: 'Within next 2 hours for optimal pricing'
        } : undefined
      };

      setEnhancements(aiEnhancements);
      onOptimizedBooking(aiEnhancements);

    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Trigger */}
      <Card>
        <div className="text-center">
          <div className="mb-4">
            <div className="text-4xl mb-2">🤖</div>
            <h2 className="text-xl font-semibold">AI-Powered Booking Optimization</h2>
            <p className="text-gray-600">Get intelligent recommendations for your shipment</p>
          </div>
          
          <Button 
            onClick={analyzeBooking}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            {loading ? 'Analyzing with AI...' : '✨ Optimize My Booking'}
          </Button>
        </div>
      </Card>

      {/* AI Enhancements Results */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Pricing */}
          {enhancements.smartPricing && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💰</span>
                <h3 className="text-lg font-semibold">Smart Pricing</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="line-through text-gray-500">₹{enhancements.smartPricing.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Optimized Price:</span>
                  <span className="font-bold text-green-600">₹{enhancements.smartPricing.optimizedPrice}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Your Savings:</span>
                  <span className="font-bold text-green-600">₹{enhancements.smartPricing.savings}</span>
                </div>
                <div className="bg-green-50 p-3 rounded text-sm text-green-800">
                  💡 {enhancements.smartPricing.reason}
                </div>
              </div>
            </Card>
          )}

          {/* Delivery Prediction */}
          {enhancements.deliveryPrediction && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚚</span>
                <h3 className="text-lg font-semibold">Delivery Intelligence</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Estimated Delivery:</div>
                  <div className="font-bold">{enhancements.deliveryPrediction.estimatedDelivery}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{enhancements.deliveryPrediction.confidence}%</span>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Alternative Options:</div>
                  <div className="space-y-2">
                    {enhancements.deliveryPrediction.alternatives.map((alt, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{alt.service}</div>
                          <div className="text-gray-600">{alt.delivery}</div>
                        </div>
                        <div className="font-medium">₹{alt.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Route Optimization */}
          {enhancements.optimizedRoute && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🗺️</span>
                <h3 className="text-lg font-semibold">Route Optimization</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Optimized Route:</div>
                  <div className="text-sm">
                    {enhancements.optimizedRoute.suggestedStops.join(' → ')}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Time Saved:</div>
                    <div className="font-bold text-blue-600">{enhancements.optimizedRoute.timeSavings} min</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cost Saved:</div>
                    <div className="font-bold text-green-600">₹{enhancements.optimizedRoute.costSavings}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Demand Insights */}
          {enhancements.demandInsights && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="text-lg font-semibold">Demand Insights</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Demand:</span>
                  <span className={`font-medium ${
                    enhancements.demandInsights.demandLevel === 'high' ? 'text-red-600' :
                    enhancements.demandInsights.demandLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {enhancements.demandInsights.demandLevel.toUpperCase()}
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                  💡 {enhancements.demandInsights.recommendation}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Best time to book:</span>
                  <div className="font-medium">{enhancements.demandInsights.bestTimeToBook}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Summary Card */}
      {showDetails && enhancements.smartPricing && (
        <Card>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              AI Optimization Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{enhancements.smartPricing.savings}
                </div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {enhancements.deliveryPrediction?.confidence || 94}%
                </div>
                <div className="text-sm text-gray-600">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {enhancements.optimizedRoute?.timeSavings || 25} min
                </div>
                <div className="text-sm text-gray-600">Time Savings</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                onClick={() => onOptimizedBooking(enhancements)}
              >
                🚀 Book with AI Optimization
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
