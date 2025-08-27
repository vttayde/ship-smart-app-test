'use client'

import { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationPicker from '@/components/LocationPicker';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface RouteData {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  startAddress: string;
  endAddress: string;
}

export default function MapDemoPage() {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateShippingCost = async () => {
    if (!origin || !destination) return;

    setLoading(true);
    try {
      const response = await fetch('/api/maps/distance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: origin.address,
          destination: destination.address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEstimatedCost(data.shippingCost);
      } else {
        console.error('Failed to calculate shipping cost:', data.error);
      }
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteCalculated = (data: RouteData) => {
    setRouteData(data);
  };

  const resetForm = () => {
    setOrigin(null);
    setDestination(null);
    setRouteData(null);
    setEstimatedCost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Google Maps Integration Demo</h1>
            <p className="text-blue-100">Test location picker, route calculation, and shipping cost estimation</p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Location Inputs */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select Locations</h2>
                  
                  {/* Origin Location */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <LocationPicker
                      placeholder="Enter pickup address..."
                      onLocationSelect={setOrigin}
                      className="w-full"
                    />
                    {origin && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <strong>Selected:</strong> {origin.address}
                        <br />
                        <span className="text-gray-600">
                          Lat: {origin.lat.toFixed(6)}, Lng: {origin.lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Destination Location */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location
                    </label>
                    <LocationPicker
                      placeholder="Enter delivery address..."
                      onLocationSelect={setDestination}
                      className="w-full"
                    />
                    {destination && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <strong>Selected:</strong> {destination.address}
                        <br />
                        <span className="text-gray-600">
                          Lat: {destination.lat.toFixed(6)}, Lng: {destination.lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={calculateShippingCost}
                      disabled={!origin || !destination || loading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Calculating...' : 'Calculate Cost'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Route Information */}
                {routeData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Route Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Distance:</strong> {routeData.distance.text}
                      </div>
                      <div>
                        <strong>Duration:</strong> {routeData.duration.text}
                      </div>
                      <div>
                        <strong>From:</strong> {routeData.startAddress}
                      </div>
                      <div>
                        <strong>To:</strong> {routeData.endAddress}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Cost */}
                {estimatedCost !== null && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Shipping Cost Estimate</h3>
                    <div className="text-2xl font-bold text-green-700">
                      ₹{estimatedCost.toFixed(2)}
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Based on distance and current rates
                    </p>
                  </div>
                )}
              </div>

              {/* Right Panel - Map */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Route Visualization</h2>
                <MapComponent
                  origin={origin ? { lat: origin.lat, lng: origin.lng, address: origin.address } : undefined}
                  destination={destination ? { lat: destination.lat, lng: destination.lng, address: destination.address } : undefined}
                  onRouteCalculated={handleRouteCalculated}
                  height="500px"
                  showDirections={!!(origin && destination)}
                />
              </div>
            </div>

            {/* API Test Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">API Integration Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Google Maps API</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {typeof window !== 'undefined' && (window as unknown as { google?: unknown }).google 
                      ? '✅ Loaded successfully' 
                      : '⏳ Loading...'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Places Autocomplete</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {origin || destination ? '✅ Working' : '⏳ Enter an address to test'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Distance Matrix</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {routeData ? '✅ Route calculated' : '⏳ Select both locations to test'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
