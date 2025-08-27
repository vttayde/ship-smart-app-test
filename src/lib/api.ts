// API utility functions for frontend

export interface CourierService {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedDays: string;
  rating: number;
  features: string[];
  route?: string;
}

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
}

export interface TrackingInfo {
  id: string;
  status: string;
  courier: string;
  estimatedDelivery: string;
  currentLocation: string;
  timeline: TrackingEvent[];
}

export interface BookingRequest {
  courierId: string;
  from: string;
  to: string;
  weight: number;
  senderDetails: {
    name: string;
    phone: string;
    address: string;
  };
  receiverDetails: {
    name: string;
    phone: string;
    address: string;
  };
}

// Fetch courier services with pricing
export async function fetchCourierServices(from: string, to: string, weight: number): Promise<CourierService[]> {
  const params = new URLSearchParams({
    from,
    to,
    weight: weight.toString()
  });

  const response = await fetch(`/api/couriers?${params}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch courier services');
  }
  
  return data.data;
}

// Fetch tracking information
export async function fetchTrackingInfo(trackingId: string): Promise<TrackingInfo> {
  const response = await fetch(`/api/tracking?id=${trackingId}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch tracking information');
  }
  
  return data.data;
}

// Create a booking
export async function createBooking(bookingData: BookingRequest) {
  const response = await fetch('/api/couriers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to create booking');
  }
  
  return data.booking;
}

// Update tracking status (admin function)
export async function updateTrackingStatus(trackingId: string, newStatus: string, location: string) {
  const response = await fetch('/api/tracking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trackingId,
      newStatus,
      location,
    }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to update tracking status');
  }
  
  return data.data;
}
