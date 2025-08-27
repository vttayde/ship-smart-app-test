'use client';

import React, { useState } from 'react';
import { Navigation, Button, Card, Input } from '@/components';
import BookingModal from '@/components/BookingModal';
import { fetchCourierServices } from '@/lib/api';
import type { CourierService } from '@/lib/api';

export default function ServicesPage() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [courierServices, setCourierServices] = useState<CourierService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Booking modal state
  const [selectedService, setSelectedService] = useState<CourierService | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleSearch = async () => {
    if (!fromLocation.trim() || !toLocation.trim() || !weight.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const services = await fetchCourierServices(fromLocation, toLocation, weightNum);
      setCourierServices(services);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courier services');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (service: CourierService) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="services" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Courier Services</h1>
          <p className="text-xl text-gray-600">Find the best rates and delivery options for your shipment</p>
        </div>

        {/* Search Form */}
        <Card padding="lg" className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              label="From"
              placeholder="Delhi"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
            />
            <Input
              label="To"
              placeholder="Mumbai"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              placeholder="1.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Compare Prices'}
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </Card>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
            {courierServices.map((service) => (
              <Card key={service.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{service.logo}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-gray-600">Delivery: {service.estimatedDays}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">₹{service.price}</div>
                    <p className="text-sm text-gray-500">+ taxes</p>
                  </div>
                  
                  <div className="text-right">
                    <Button 
                      className="mb-2"
                      onClick={() => handleBookNow(service)}
                    >
                      Book Now
                    </Button>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No results message */}
        {!showResults && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Enter shipment details</h3>
            <p className="text-gray-600">Fill in the form above to compare courier services and prices</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={closeBookingModal}
          service={selectedService}
          searchParams={{
            from: fromLocation,
            to: toLocation,
            weight: parseFloat(weight) || 0
          }}
        />
      )}
    </div>
  );
}
