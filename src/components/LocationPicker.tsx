'use client'

import { useState, useRef, useEffect, useCallback } from 'react';

interface LocationPickerProps {
  placeholder?: string;
  onLocationSelect?: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
  className?: string;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

export default function LocationPicker({
  placeholder = "Enter address...",
  onLocationSelect,
  defaultValue = "",
  className = ""
}: LocationPickerProps) {
  const [address, setAddress] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteService = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geocoder = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeServices = useCallback(() => {
    if (isLoaded) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      geocoder.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Load Google Maps script
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      initializeServices();
    }
  }, [isLoaded, initializeServices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      if (value.length > 2 && autocompleteService.current) {
        const request = {
          input: value,
          componentRestrictions: { country: 'in' }, // Restrict to India
          types: ['address'],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autocompleteService.current.getPlacePredictions(request, (predictions: any[], status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions);
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        });
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 300);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePredictionSelect = (prediction: any) => {
    const selectedAddress = prediction.description;
    setAddress(selectedAddress);
    setShowPredictions(false);

    // Geocode the selected address to get coordinates
    if (geocoder.current) {
      const request = {
        address: selectedAddress,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoder.current.geocode(request, (results: any[], status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          onLocationSelect?.({
            address: selectedAddress,
            lat: location.lat(),
            lng: location.lng(),
          });
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowPredictions(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding predictions to allow click events
    setTimeout(() => setShowPredictions(false), 150);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={address}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => predictions.length > 0 && setShowPredictions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        disabled={!isLoaded}
      />
      
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id || index}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <div className="font-medium text-gray-900">
                {prediction.structured_formatting?.main_text || prediction.description}
              </div>
              {prediction.structured_formatting?.secondary_text && (
                <div className="text-sm text-gray-600">
                  {prediction.structured_formatting.secondary_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
