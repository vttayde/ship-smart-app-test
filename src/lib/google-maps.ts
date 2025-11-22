// Google Maps disabled in mock mode
// All functions return mock data to avoid external API calls

// Interface for location coordinates
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Interface for distance matrix result
export interface DistanceResult {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  status: string;
}

// Interface for route optimization
export interface RouteOptimization {
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  optimizeWaypoints?: boolean;
}

// Geocode an address to get coordinates
export async function geocodeAddress(address: string): Promise<Location | null> { return { lat: 0, lng: 0, address }; }

// Reverse geocode coordinates to get address
export async function reverseGeocode(_lat: number, _lng: number): Promise<string | null> { return 'Mock Address'; }

// Calculate distance and duration between two points
export async function calculateDistance(_origin: string | Location, _destination: string | Location): Promise<DistanceResult | null> { return { distance: { text: '0 km', value: 0 }, duration: { text: '0 mins', value: 0 }, status: 'OK' }; }

// Get directions between points
export async function getDirections(_route: RouteOptimization) { return { mock: true }; }

// Calculate shipping cost based on distance
export function calculateShippingCost(distanceKm: number, weightKg: number, baseRatePerKm: number = 2): number {
  const baseCost = distanceKm * baseRatePerKm;
  const weightMultiplier = Math.max(1, weightKg / 5); // Extra cost for heavier packages
  const minimumCost = 50; // Minimum shipping cost
  
  return Math.max(minimumCost, Math.round(baseCost * weightMultiplier));
}

// Estimate delivery time based on distance
export function estimateDeliveryTime(distanceKm: number): { days: number; description: string } {
  if (distanceKm <= 50) {
    return { days: 1, description: 'Same day delivery' };
  } else if (distanceKm <= 200) {
    return { days: 1, description: 'Next day delivery' };
  } else if (distanceKm <= 500) {
    return { days: 2, description: '2-3 days delivery' };
  } else if (distanceKm <= 1000) {
    return { days: 3, description: '3-4 days delivery' };
  } else {
    return { days: 5, description: '5-7 days delivery' };
  }
}
