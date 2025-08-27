import { Client } from '@googlemaps/google-maps-services-js';

// Server-side Google Maps client
const googleMapsClient = new Client({});

// API Key from environment
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

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
export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Reverse geocode coordinates to get address
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await googleMapsClient.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Calculate distance and duration between two points
export async function calculateDistance(
  origin: string | Location,
  destination: string | Location
): Promise<DistanceResult | null> {
  try {
    const originParam = typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`;
    const destinationParam = typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`;

    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [originParam],
        destinations: [destinationParam],
        key: GOOGLE_MAPS_API_KEY,
        units: 'metric',
      },
    });

    const element = response.data.rows[0]?.elements[0];
    if (element && element.status === 'OK') {
      return {
        distance: element.distance,
        duration: element.duration,
        status: element.status,
      };
    }
    return null;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return null;
  }
}

// Get directions between points
export async function getDirections(route: RouteOptimization) {
  try {
    const originParam = `${route.origin.lat},${route.origin.lng}`;
    const destinationParam = `${route.destination.lat},${route.destination.lng}`;
    
    const waypointsParam = route.waypoints?.map(wp => `${wp.lat},${wp.lng}`);

    const response = await googleMapsClient.directions({
      params: {
        origin: originParam,
        destination: destinationParam,
        waypoints: waypointsParam,
        optimize: route.optimizeWaypoints || false,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Directions error:', error);
    return null;
  }
}

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
