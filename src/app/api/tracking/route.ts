import { NextRequest, NextResponse } from 'next/server';

interface TrackingEvent {
  date: string;
  status: string;
  location: string;
}

interface TrackingInfo {
  id: string;
  status: string;
  courier: string;
  estimatedDelivery: string;
  currentLocation: string;
  timeline: TrackingEvent[];
}

// Mock tracking data
const trackingData: Record<string, TrackingInfo> = {
  'DHL123456789': {
    id: 'DHL123456789',
    status: 'In Transit',
    courier: 'Delhivery',
    estimatedDelivery: '2025-08-28',
    currentLocation: 'Mumbai Sorting Facility',
    timeline: [
      { date: '2025-08-26 10:00', status: 'Package Picked Up', location: 'Delhi' },
      { date: '2025-08-26 15:30', status: 'In Transit', location: 'Delhi Hub' },
      { date: '2025-08-27 08:00', status: 'Reached Destination City', location: 'Mumbai Hub' },
      { date: '2025-08-27 12:00', status: 'Out for Delivery', location: 'Mumbai Sorting Facility' },
    ]
  },
  'SHADOW987654321': {
    id: 'SHADOW987654321',
    status: 'Delivered',
    courier: 'Shadowfax',
    estimatedDelivery: '2025-08-26',
    currentLocation: 'Delivered',
    timeline: [
      { date: '2025-08-25 09:00', status: 'Package Picked Up', location: 'Bangalore' },
      { date: '2025-08-25 14:00', status: 'In Transit', location: 'Bangalore Hub' },
      { date: '2025-08-26 08:00', status: 'Out for Delivery', location: 'Chennai Hub' },
      { date: '2025-08-26 11:30', status: 'Delivered', location: 'Chennai - Customer Location' },
    ]
  },
  'EKART555444333': {
    id: 'EKART555444333',
    status: 'Processing',
    courier: 'Ekart Logistics',
    estimatedDelivery: '2025-08-29',
    currentLocation: 'Pickup Pending',
    timeline: [
      { date: '2025-08-26 16:00', status: 'Order Placed', location: 'Pune' },
      { date: '2025-08-26 17:00', status: 'Processing', location: 'Pune Warehouse' },
    ]
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get('id');

  if (!trackingId) {
    return NextResponse.json({
      success: false,
      error: 'Tracking ID is required'
    }, { status: 400 });
  }

  const tracking = trackingData[trackingId];

  if (!tracking) {
    return NextResponse.json({
      success: false,
      error: 'Tracking ID not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: tracking
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trackingId, newStatus, location } = body;

  // Mock updating tracking status
  if (trackingData[trackingId]) {
    const newEvent = {
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: newStatus,
      location: location
    };

    trackingData[trackingId].timeline.push(newEvent);
    trackingData[trackingId].status = newStatus;
    trackingData[trackingId].currentLocation = location;

    return NextResponse.json({
      success: true,
      message: 'Tracking updated successfully',
      data: trackingData[trackingId]
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Tracking ID not found'
  }, { status: 404 });
}
