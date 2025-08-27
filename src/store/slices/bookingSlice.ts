import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingData {
  id?: string;
  originAddress: string;
  destinationAddress: string;
  packageDetails: {
    weight: number;
    dimensions: string;
    value: number;
    description: string;
    priority: 'standard' | 'express' | 'urgent';
  };
  senderDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  receiverDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  selectedCourier?: {
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
  };
  pickupDate: string;
  specialInstructions?: string;
  insurance?: boolean;
  status?: 'draft' | 'confirmed' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BookingState {
  currentBooking: BookingData | null;
  bookingHistory: BookingData[];
  isLoading: boolean;
  error: string | null;
  step: number;
  availableCouriers: Array<{
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
    rating: number;
    features: string[];
  }>;
}

const initialState: BookingState = {
  currentBooking: null,
  bookingHistory: [],
  isLoading: false,
  error: null,
  step: 1,
  availableCouriers: []
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state: BookingState, action: PayloadAction<BookingData>) => {
      state.currentBooking = action.payload;
      state.error = null;
    },
    
    updateBookingData: (state: BookingState, action: PayloadAction<Partial<BookingData>>) => {
      if (state.currentBooking) {
        state.currentBooking = { ...state.currentBooking, ...action.payload };
      } else {
        state.currentBooking = action.payload as BookingData;
      }
      state.error = null;
    },
    
    setBookingStep: (state: BookingState, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    
    nextStep: (state: BookingState) => {
      state.step += 1;
    },
    
    previousStep: (state: BookingState) => {
      if (state.step > 1) {
        state.step -= 1;
      }
    },
    
    setAvailableCouriers: (state: BookingState, action: PayloadAction<BookingState['availableCouriers']>) => {
      state.availableCouriers = action.payload;
    },
    
    selectCourier: (state: BookingState, action: PayloadAction<BookingState['availableCouriers'][0]>) => {
      if (state.currentBooking) {
        state.currentBooking.selectedCourier = {
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          estimatedDelivery: action.payload.estimatedDelivery
        };
      }
    },
    
    confirmBooking: (state: BookingState) => {
      if (state.currentBooking) {
        const confirmedBooking = {
          ...state.currentBooking,
          id: `BK${Date.now()}`,
          status: 'confirmed' as const,
          trackingNumber: `SS${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        state.bookingHistory.unshift(confirmedBooking);
        state.currentBooking = null;
        state.step = 1;
      }
    },
    
    addToHistory: (state: BookingState, action: PayloadAction<BookingData>) => {
      state.bookingHistory.unshift(action.payload);
    },
    
    updateBookingStatus: (state: BookingState, action: PayloadAction<{ id: string; status: BookingData['status'] }>) => {
      const booking = state.bookingHistory.find((b: BookingData) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
        booking.updatedAt = new Date().toISOString();
      }
    },
    
    clearCurrentBooking: (state: BookingState) => {
      state.currentBooking = null;
      state.step = 1;
      state.error = null;
    },
    
    setLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state: BookingState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state: BookingState) => {
      state.error = null;
    }
  }
});

// Action creators
export const {
  setCurrentBooking,
  updateBookingData,
  setBookingStep,
  nextStep,
  previousStep,
  setAvailableCouriers,
  selectCourier,
  confirmBooking,
  addToHistory,
  updateBookingStatus,
  clearCurrentBooking,
  setLoading,
  setError,
  clearError
} = bookingSlice.actions;

// Define RootState interface for this module
interface RootState {
  booking: BookingState;
}

// Async thunk for creating a booking
export const createBooking = (bookingData: BookingData) => async (dispatch: (action: any) => void) => {
  dispatch(setLoading(true));
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBooking = {
      ...bookingData,
      id: `BK${Date.now()}`,
      status: 'confirmed' as const,
      trackingNumber: `SS${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch(addToHistory(newBooking));
    dispatch(clearCurrentBooking());
    dispatch(setLoading(false));
    
    return newBooking;
  } catch (error) {
    dispatch(setError('Failed to create booking'));
    throw error;
  }
};

// Async thunk for fetching courier rates
export const fetchCourierRates = (origin: string, destination: string, weight: number) => async (dispatch: (action: any) => void) => {
  dispatch(setLoading(true));
  try {
    // Simulate API call to get courier rates
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockCouriers = [
      {
        id: 'delhivery',
        name: 'Delhivery',
        price: Math.floor(120 + (weight * 10) + Math.random() * 50),
        estimatedDelivery: '1-2 Business Days',
        rating: 4.2,
        features: ['Free Pickup', 'SMS Updates', 'Insurance Included', 'Proof of Delivery']
      },
      {
        id: 'shadowfax',
        name: 'Shadowfax',
        price: Math.floor(150 + (weight * 12) + Math.random() * 40),
        estimatedDelivery: 'Same Day Delivery',
        rating: 4.5,
        features: ['Same Day', 'Live Tracking', 'Priority Handling', 'Express Service']
      },
      {
        id: 'ekart',
        name: 'Ekart',
        price: Math.floor(95 + (weight * 8) + Math.random() * 30),
        estimatedDelivery: '2-3 Business Days',
        rating: 4.0,
        features: ['Budget Friendly', 'Wide Coverage', 'Reliable Network', 'Standard Tracking']
      }
    ];
    
    dispatch(setAvailableCouriers(mockCouriers));
    dispatch(setLoading(false));
    
    return mockCouriers;
  } catch (error) {
    dispatch(setError('Failed to fetch courier rates'));
    throw error;
  }
};

// Selectors
export const selectCurrentBooking = (state: RootState) => state.booking.currentBooking;
export const selectBookingHistory = (state: RootState) => state.booking.bookingHistory;
export const selectBookingStep = (state: RootState) => state.booking.step;
export const selectAvailableCouriers = (state: RootState) => state.booking.availableCouriers;
export const selectBookingLoading = (state: RootState) => state.booking.isLoading;
export const selectBookingError = (state: RootState) => state.booking.error;

export default bookingSlice.reducer;
