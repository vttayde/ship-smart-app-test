import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CourierService {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedDays: string;
  rating: number;
  features: string[];
}

interface BookingData {
  service?: CourierService;
  from?: string;
  to?: string;
  weight?: number;
  senderDetails?: {
    name: string;
    phone: string;
    address: string;
  };
  receiverDetails?: {
    name: string;
    phone: string;
    address: string;
  };
}

interface AppState {
  // Search state
  searchForm: {
    from: string;
    to: string;
    weight: string;
  };
  
  // Courier services
  courierServices: CourierService[];
  isSearching: boolean;
  
  // Booking state
  currentBooking: BookingData;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  searchForm: {
    from: '',
    to: '',
    weight: '',
  },
  courierServices: [],
  isSearching: false,
  currentBooking: {},
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSearchForm: (state, action: PayloadAction<Partial<AppState['searchForm']>>) => {
      state.searchForm = { ...state.searchForm, ...action.payload };
    },
    
    searchStart: (state) => {
      state.isSearching = true;
      state.error = null;
    },
    
    searchSuccess: (state, action: PayloadAction<CourierService[]>) => {
      state.isSearching = false;
      state.courierServices = action.payload;
      state.error = null;
    },
    
    searchFailure: (state, action: PayloadAction<string>) => {
      state.isSearching = false;
      state.error = action.payload;
    },
    
    setBookingData: (state, action: PayloadAction<Partial<BookingData>>) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
    },
    
    clearBooking: (state) => {
      state.currentBooking = {};
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchForm,
  searchStart,
  searchSuccess,
  searchFailure,
  setBookingData,
  clearBooking,
  setLoading,
  clearError,
  setError,
} = appSlice.actions;

export default appSlice.reducer;
