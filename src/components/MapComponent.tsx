'use client'

import { useEffect, useRef, useState } from 'react';

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

interface MapComponentProps {
  origin?: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
  onRouteCalculated?: (data: RouteData) => void;
  height?: string;
  showDirections?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

export default function MapComponent({
  origin,
  destination,
  onRouteCalculated,
  height = '400px',
  showDirections = true
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [directionsService, setDirectionsService] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 20.5937, lng: 78.9629 }, // India center
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(mapInstance);
    setDirectionsService(new google.maps.DirectionsService());
    setDirectionsRenderer(new google.maps.DirectionsRenderer({
      draggable: false,
      panel: undefined,
    }));
  }, [isLoaded]);

  // Set up directions renderer
  useEffect(() => {
    if (map && directionsRenderer) {
      directionsRenderer.setMap(map);
    }
  }, [map, directionsRenderer]);

  // Calculate and display route
  useEffect(() => {
    if (!origin || !destination || !directionsService || !directionsRenderer || !showDirections) {
      return;
    }

    const request = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result);
        
        // Calculate route information
        const route = result.routes[0];
        const leg = route.legs[0];
        
        const routeData: RouteData = {
          distance: {
            text: leg.distance?.text || '',
            value: leg.distance?.value || 0,
          },
          duration: {
            text: leg.duration?.text || '',
            value: leg.duration?.value || 0,
          },
          startAddress: leg.start_address,
          endAddress: leg.end_address,
        };

        onRouteCalculated?.(routeData);
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }, [origin, destination, directionsService, directionsRenderer, showDirections, onRouteCalculated]);

  // Add markers for origin and destination when not showing directions
  useEffect(() => {
    if (!map || showDirections) return;

    // Clear existing markers
    // Note: In a real implementation, you'd want to track and clear markers

    if (origin) {
      new google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map: map,
        title: origin.address || 'Origin',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10B981"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        },
      });
    }

    if (destination) {
      new google.maps.Marker({
        position: { lat: destination.lat, lng: destination.lng },
        map: map,
        title: destination.address || 'Destination',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        },
      });

      // Fit map to show both points
      if (origin) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
        bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));
        map.fitBounds(bounds);
      }
    }
  }, [map, origin, destination, showDirections]);

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} style={{ height, width: '100%' }} />
    </div>
  );
}
