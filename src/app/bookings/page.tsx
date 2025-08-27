'use client'

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Booking {
  id: string;
  trackingNumber: string;
  status: string;
  originAddress: string;
  destinationAddress: string;
  courierPartner: string;
  packageWeight: number;
  packageValue: number;
  distanceKm: number;
  estimatedDurationMinutes?: number;
  totalAmount: number;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching bookings
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        trackingNumber: 'SS2025001',
        status: 'in_transit',
        originAddress: 'Mumbai, Maharashtra, India',
        destinationAddress: 'Delhi, Delhi, India',
        courierPartner: 'Delhivery',
        packageWeight: 2.5,
        packageValue: 5000,
        distanceKm: 1420,
        estimatedDurationMinutes: 1170,
        totalAmount: 25600,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        trackingNumber: 'SS2025002',
        status: 'delivered',
        originAddress: 'Bangalore, Karnataka, India',
        destinationAddress: 'Chennai, Tamil Nadu, India',
        courierPartner: 'Shadowfax',
        packageWeight: 1.2,
        packageValue: 2000,
        distanceKm: 350,
        estimatedDurationMinutes: 480,
        totalAmount: 7740,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        trackingNumber: 'SS2025003',
        status: 'pending',
        originAddress: 'Pune, Maharashtra, India',
        destinationAddress: 'Hyderabad, Telangana, India',
        courierPartner: 'BlueDart',
        packageWeight: 0.8,
        packageValue: 1500,
        distanceKm: 560,
        totalAmount: 14080,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                <p className="text-blue-100">Track and manage your shipments</p>
              </div>
              <Button 
                href="/book-shipment" 
                variant="outline" 
                className="bg-white text-blue-600 border-white hover:bg-blue-50"
              >
                + New Booking
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {bookings.filter(b => ['picked_up', 'in_transit'].includes(b.status)).length}
                </div>
                <div className="text-sm text-gray-600">In Transit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first shipment booking</p>
            <Button href="/book-shipment">
              Create First Booking
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-lg text-gray-900">
                        #{booking.trackingNumber}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">From:</span> {booking.originAddress}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">To:</span> {booking.destinationAddress}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">Courier:</span> {booking.courierPartner}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Booked:</span> {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Weight: {booking.packageWeight}kg</span>
                        <span>Value: ₹{booking.packageValue}</span>
                        <span>Distance: {booking.distanceKm}km</span>
                        {booking.estimatedDurationMinutes && (
                          <span>Duration: {Math.round(booking.estimatedDurationMinutes / 60)}h</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{booking.totalAmount}</div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        href={`/tracking/${booking.trackingNumber}`}
                        variant="outline"
                        size="sm"
                      >
                        Track
                      </Button>
                      {booking.status === 'pending' && (
                        <Button
                          href={`/payment/${booking.id}`}
                          size="sm"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination would go here for large datasets */}
        {bookings.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
