'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import MapComponent from '@/components/MapComponent';

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  isCompleted: boolean;
}

interface ShipmentDetails {
  trackingNumber: string;
  status: string;
  originAddress: string;
  destinationAddress: string;
  courierPartner: string;
  estimatedDelivery: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  events: TrackingEvent[];
  packageDetails: {
    weight: number;
    dimensions: string;
    value: number;
  };
  contact: {
    senderName: string;
    receiverName: string;
    receiverPhone: string;
  };
}

export default function TrackingPage() {
  const params = useParams();
  const trackingNumber = params.trackingNumber as string;
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackingNumber) {
      fetchTrackingData(trackingNumber);
    }
  }, [trackingNumber]);

  const fetchTrackingData = async (tracking: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock tracking data
      const mockShipment: ShipmentDetails = {
        trackingNumber: tracking,
        status: 'in_transit',
        originAddress: 'Mumbai, Maharashtra, India',
        destinationAddress: 'Delhi, Delhi, India',
        courierPartner: 'Delhivery',
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
        currentLocation: {
          lat: 21.1458,
          lng: 79.0882,
          address: 'Nagpur, Maharashtra, India'
        },
        events: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'booked',
            location: 'Mumbai, Maharashtra',
            description: 'Shipment booked and payment confirmed',
            isCompleted: true
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(),
            status: 'picked_up',
            location: 'Mumbai Hub',
            description: 'Package picked up from sender location',
            isCompleted: true
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            status: 'in_transit',
            location: 'Mumbai Sorting Center',
            description: 'Package sorted and dispatched to destination city',
            isCompleted: true
          },
          {
            id: '4',
            timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
            status: 'in_transit',
            location: 'Nagpur Transit Hub',
            description: 'Package arrived at transit hub, currently being processed',
            isCompleted: true
          },
          {
            id: '5',
            timestamp: new Date(Date.now() + 86400000 * 0.5).toISOString(),
            status: 'out_for_delivery',
            location: 'Delhi Hub',
            description: 'Package will be out for delivery',
            isCompleted: false
          },
          {
            id: '6',
            timestamp: new Date(Date.now() + 86400000 * 1).toISOString(),
            status: 'delivered',
            location: 'Delhi, Delhi',
            description: 'Package delivered to recipient',
            isCompleted: false
          }
        ],
        packageDetails: {
          weight: 2.5,
          dimensions: '30 x 20 x 15 cm',
          value: 5000
        },
        contact: {
          senderName: 'John Doe',
          receiverName: 'Jane Smith',
          receiverPhone: '+91 98765 43210'
        }
      };

      setShipment(mockShipment);
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Failed to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tracking Your Package</h2>
              <p className="text-gray-600">Fetching the latest information for #{trackingNumber}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tracking Information Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || `We couldn't find any shipment with tracking number: ${trackingNumber}`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => fetchTrackingData(trackingNumber)}>
                Try Again
              </Button>
              <Button href="/tracking" variant="outline">
                Track Another Package
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Track Package</h1>
                <p className="text-blue-100">#{shipment.trackingNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                  {shipment.status.replace('_', ' ').toUpperCase()}
                </span>
                <Button 
                  href="/tracking" 
                  variant="outline" 
                  className="bg-white text-blue-600 border-white hover:bg-blue-50"
                  size="sm"
                >
                  Track Another
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Courier Partner</div>
                <div className="font-semibold">{shipment.courierPartner}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Location</div>
                <div className="font-semibold">{shipment.currentLocation.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Estimated Delivery</div>
                <div className="font-semibold text-green-600">
                  {formatDateTime(shipment.estimatedDelivery)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tracking Timeline */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Tracking Timeline</h2>
              <div className="space-y-4">
                {shipment.events.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        event.isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300'
                      }`} />
                      {index < shipment.events.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${
                          event.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className={`font-medium ${
                            event.isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {event.description}
                          </div>
                          <div className="text-sm text-gray-600">{event.location}</div>
                        </div>
                        <div className={`text-sm ${
                          event.isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {event.isCompleted ? formatDateTime(event.timestamp) : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Package Details */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Package Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Weight</div>
                  <div className="font-medium">{shipment.packageDetails.weight} kg</div>
                </div>
                <div>
                  <div className="text-gray-600">Dimensions</div>
                  <div className="font-medium">{shipment.packageDetails.dimensions}</div>
                </div>
                <div>
                  <div className="text-gray-600">Declared Value</div>
                  <div className="font-medium">₹{shipment.packageDetails.value}</div>
                </div>
                <div>
                  <div className="text-gray-600">Service Type</div>
                  <div className="font-medium">Standard Delivery</div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sender:</span>
                  <span className="font-medium">{shipment.contact.senderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receiver:</span>
                  <span className="font-medium">{shipment.contact.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{shipment.contact.receiverPhone}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-gray-600 mb-1">Delivery Address:</div>
                  <div className="font-medium">{shipment.destinationAddress}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Live Location</h2>
              <MapComponent
                origin={{ 
                  lat: 19.0760, 
                  lng: 72.8777, 
                  address: shipment.originAddress 
                }}
                destination={{ 
                  lat: 28.7041, 
                  lng: 77.1025, 
                  address: shipment.destinationAddress 
                }}
                height="400px"
                showDirections={true}
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-blue-900">Current Location</div>
                  <div className="text-blue-700">{shipment.currentLocation.address}</div>
                  <div className="text-blue-600 text-xs mt-1">
                    Last updated: {formatDateTime(shipment.events.filter(e => e.isCompleted).pop()?.timestamp || '')}
                  </div>
                </div>
              </div>
            </Card>

            {/* Delivery Instructions */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-900">Expected Delivery</div>
                  <div className="text-green-700">{formatDateTime(shipment.estimatedDelivery)}</div>
                </div>
                <div className="text-gray-600">
                  <strong>Note:</strong> Please ensure someone is available to receive the package. 
                  A valid ID proof may be required for delivery confirmation.
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  📞 Contact Courier Partner
                </Button>
                <Button className="w-full" variant="outline">
                  ❓ Report an Issue
                </Button>
                <Button href="/bookings" className="w-full" variant="outline">
                  📋 View All Bookings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
