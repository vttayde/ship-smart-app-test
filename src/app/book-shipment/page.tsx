'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { createBooking } from '@/store/slices/bookingSlice';
import LocationPicker from '@/components/LocationPicker';
import MapComponent from '@/components/MapComponent';
import Button from '@/components/Button';
import Card from '@/components/Card';

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

interface BookingData {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  packageWeight: number;
  packageDimensions: {
    length: number;
    width: number;
    height: number;
  };
  packageValue: number;
  pickupDate: string;
  specialInstructions: string;
}

interface CourierOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  features: string[];
  rating: number;
}

export default function BookShipmentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  // booking slice uses isLoading internally; map to loading for component logic
  const loading = useSelector((state: RootState) => (state as any).booking?.isLoading ?? false);

  // Location states
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  // Booking form states
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    packageWeight: 0,
    packageDimensions: { length: 0, width: 0, height: 0 },
    packageValue: 0,
    pickupDate: '',
    specialInstructions: ''
  });

  // Courier options
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null);
  const [calculatingRates, setCalculatingRates] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/book-shipment');
    }
  }, [session, status, router]);

  // Calculate courier rates when locations change
  useEffect(() => {
    if (pickupLocation && deliveryLocation && routeData) {
      calculateCourierRates();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLocation, deliveryLocation, routeData]);

  const calculateCourierRates = async () => {
    if (!routeData) return;
    
    setCalculatingRates(true);
    try {
      // Simulate courier rate calculation
      const baseDistance = routeData.distance.value / 1000; // km
      const mockOptions: CourierOption[] = [
        {
          id: 'delhivery',
          name: 'Delhivery',
          price: Math.round(baseDistance * 18 + 50),
          estimatedDays: '2-3 days',
          features: ['Real-time tracking', 'Insurance included', 'SMS updates'],
          rating: 4.2
        },
        {
          id: 'shadowfax',
          name: 'Shadowfax',
          price: Math.round(baseDistance * 22 + 40),
          estimatedDays: '1-2 days',
          features: ['Same-day delivery', 'Premium tracking', 'Express service'],
          rating: 4.5
        },
        {
          id: 'ekart',
          name: 'Ekart',
          price: Math.round(baseDistance * 16 + 60),
          estimatedDays: '3-4 days',
          features: ['Economy rates', 'Standard tracking', 'COD available'],
          rating: 4.0
        },
        {
          id: 'bluedart',
          name: 'BlueDart',
          price: Math.round(baseDistance * 25 + 80),
          estimatedDays: '1-2 days',
          features: ['Premium service', 'Guaranteed delivery', 'Live tracking'],
          rating: 4.7
        }
      ];

      setCourierOptions(mockOptions);
    } catch (error) {
      console.error('Error calculating courier rates:', error);
    } finally {
      setCalculatingRates(false);
    }
  };

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension: keyof BookingData['packageDimensions'], value: number) => {
    setBookingData(prev => ({
      ...prev,
      packageDimensions: {
        ...prev.packageDimensions,
        [dimension]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    if (!pickupLocation || !deliveryLocation || !selectedCourier || !routeData) return;

    const bookingPayload = {
      // Location data
      originAddress: pickupLocation.address,
      destinationAddress: deliveryLocation.address,
      pickupLat: pickupLocation.lat,
      pickupLng: pickupLocation.lng,
      deliveryLat: deliveryLocation.lat,
      deliveryLng: deliveryLocation.lng,
      
      // Route data
      distanceKm: routeData.distance.value / 1000,
      estimatedDurationMinutes: routeData.duration.value / 60,
      
      // Booking details
      ...bookingData,
      
      // Courier selection
      courierPartner: selectedCourier.name,
      totalAmount: selectedCourier.price,
      
      // User data
      userId: session?.user?.id || 'anonymous'
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await dispatch(createBooking(bookingPayload) as any);
      router.push('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Book New Shipment</h1>
            <p className="text-blue-100">Complete booking flow with location, package details, and courier selection</p>
          </div>

          {/* Progress Indicator */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <div className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Locations'}
                    {step === 2 && 'Package Details'}
                    {step === 3 && 'Courier Selection'}
                    {step === 4 && 'Confirmation'}
                  </div>
                  {step < 4 && (
                    <div className={`ml-4 w-16 h-0.5 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {/* Step 1: Locations */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Select Pickup & Delivery Locations</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <LocationPicker
                      placeholder="Enter pickup address..."
                      onLocationSelect={setPickupLocation}
                    />
                    {pickupLocation && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                        📍 {pickupLocation.address}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location
                    </label>
                    <LocationPicker
                      placeholder="Enter delivery address..."
                      onLocationSelect={setDeliveryLocation}
                    />
                    {deliveryLocation && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        📍 {deliveryLocation.address}
                      </div>
                    )}
                  </div>

                  {routeData && (
                    <Card>
                      <h3 className="font-semibold mb-2">Route Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div><strong>Distance:</strong> {routeData.distance.text}</div>
                        <div><strong>Duration:</strong> {routeData.duration.text}</div>
                      </div>
                    </Card>
                  )}
                </div>

                <div>
                  <MapComponent
                    origin={pickupLocation ? { 
                      lat: pickupLocation.lat, 
                      lng: pickupLocation.lng, 
                      address: pickupLocation.address 
                    } : undefined}
                    destination={deliveryLocation ? { 
                      lat: deliveryLocation.lat, 
                      lng: deliveryLocation.lng, 
                      address: deliveryLocation.address 
                    } : undefined}
                    onRouteCalculated={setRouteData}
                    height="400px"
                    showDirections={!!(pickupLocation && deliveryLocation)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Package Details */}
            {currentStep === 2 && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Package & Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sender Details */}
                  <Card>
                    <h3 className="font-semibold mb-4">Sender Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={bookingData.senderName}
                          onChange={(e) => handleInputChange('senderName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter sender name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={bookingData.senderPhone}
                          onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Receiver Details */}
                  <Card>
                    <h3 className="font-semibold mb-4">Receiver Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={bookingData.receiverName}
                          onChange={(e) => handleInputChange('receiverName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter receiver name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={bookingData.receiverPhone}
                          onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Package Details */}
                <Card className="mt-6">
                  <h3 className="font-semibold mb-4">Package Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={bookingData.packageWeight}
                          onChange={(e) => handleInputChange('packageWeight', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.0"
                          step="0.1"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Package Value (₹)
                        </label>
                        <input
                          type="number"
                          value={bookingData.packageValue}
                          onChange={(e) => handleInputChange('packageValue', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.pickupDate}
                          onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dimensions (cm)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={bookingData.packageDimensions.length}
                            onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="L"
                            min="0"
                          />
                          <input
                            type="number"
                            value={bookingData.packageDimensions.width}
                            onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="W"
                            min="0"
                          />
                          <input
                            type="number"
                            value={bookingData.packageDimensions.height}
                            onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="H"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          value={bookingData.specialInstructions}
                          onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Any special handling instructions..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Courier Selection */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Choose Courier Partner</h2>
                
                {calculatingRates ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Calculating best rates from our partner couriers...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courierOptions.map((courier) => (
                      <div 
                        key={courier.id}
                        className={`cursor-pointer transition-all p-6 rounded-lg border ${
                          selectedCourier?.id === courier.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                            : 'hover:shadow-md border-gray-200 bg-white'
                        }`}
                        onClick={() => setSelectedCourier(courier)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{courier.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span>⭐ {courier.rating}</span>
                              <span>•</span>
                              <span>{courier.estimatedDays}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">₹{courier.price}</div>
                            <div className="text-sm text-gray-600">Total cost</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {courier.features.map((feature, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Booking Confirmation</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Location Summary */}
                    <Card>
                      <h3 className="font-semibold mb-3">Route Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>From:</strong> {pickupLocation?.address}</div>
                        <div><strong>To:</strong> {deliveryLocation?.address}</div>
                        {routeData && (
                          <>
                            <div><strong>Distance:</strong> {routeData.distance.text}</div>
                            <div><strong>Duration:</strong> {routeData.duration.text}</div>
                          </>
                        )}
                      </div>
                    </Card>

                    {/* Package Summary */}
                    <Card>
                      <h3 className="font-semibold mb-3">Package Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Weight:</strong> {bookingData.packageWeight} kg</div>
                        <div><strong>Dimensions:</strong> {bookingData.packageDimensions.length} × {bookingData.packageDimensions.width} × {bookingData.packageDimensions.height} cm</div>
                        <div><strong>Value:</strong> ₹{bookingData.packageValue}</div>
                        <div><strong>Pickup Date:</strong> {bookingData.pickupDate}</div>
                      </div>
                    </Card>

                    {/* Contact Summary */}
                    <Card>
                      <h3 className="font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Sender:</strong> {bookingData.senderName} ({bookingData.senderPhone})</div>
                        <div><strong>Receiver:</strong> {bookingData.receiverName} ({bookingData.receiverPhone})</div>
                      </div>
                    </Card>
                  </div>

                  <div>
                    {/* Courier Summary */}
                    {selectedCourier && (
                      <Card>
                        <h3 className="font-semibold mb-3">Selected Courier</h3>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-semibold text-lg">{selectedCourier.name}</div>
                            <div className="text-sm text-gray-600">{selectedCourier.estimatedDays}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">₹{selectedCourier.price}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {selectedCourier.features.map((feature, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Payment Button */}
                    <div className="mt-6">
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? 'Creating Booking...' : `Proceed to Payment - ₹${selectedCourier?.price}`}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        You will be redirected to payment gateway after booking confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!pickupLocation || !deliveryLocation)) ||
                    (currentStep === 2 && (!bookingData.senderName || !bookingData.receiverName || !bookingData.senderPhone || !bookingData.receiverPhone)) ||
                    (currentStep === 3 && !selectedCourier)
                  }
                >
                  Next
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
