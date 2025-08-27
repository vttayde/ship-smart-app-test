'use client';

import React, { useState } from 'react';
import { Navigation, Button, Card, Input } from '@/components';
import { fetchTrackingInfo } from '@/lib/api';
import type { TrackingInfo } from '@/lib/api';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await fetchTrackingInfo(trackingId);
      setTrackingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracking information');
      setTrackingResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="tracking" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Package</h1>
          <p className="text-xl text-gray-600">Enter your tracking ID to get real-time updates on your shipment</p>
        </div>

        {/* Tracking Form */}
        <Card padding="lg" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter tracking ID (e.g., DHL123456789)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleTrack} 
              disabled={loading || !trackingId.trim()}
              className="sm:w-auto"
            >
              {loading ? 'Tracking...' : 'Track Package'}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </Card>

        {/* Tracking Results */}
        {trackingResult && (
          <Card padding="lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tracking Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking ID</p>
                  <p className="font-semibold">{trackingResult.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courier</p>
                  <p className="font-semibold">{trackingResult.courier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-semibold text-blue-600">{trackingResult.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-semibold">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tracking Timeline</h3>
              <div className="space-y-4">
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      <p className="text-xs text-gray-400">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Sample Tracking IDs */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">Try these sample tracking IDs:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTrackingId('DHL123456789')}
            >
              DHL123456789
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTrackingId('SHADOW987654321')}
            >
              SHADOW987654321
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTrackingId('EKART555444333')}
            >
              EKART555444333
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
