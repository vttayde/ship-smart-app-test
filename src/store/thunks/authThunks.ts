import { createAsyncThunk } from '@reduxjs/toolkit';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Async thunk for login
export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.user;
      } else {
        return rejectWithValue(data.error || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk<
  User,
  SignupData,
  { rejectValue: string }
>(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.user;
      } else {
        return rejectWithValue(data.error || 'Signup failed');
      }
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Async thunk for fetching courier services
export const fetchCourierServices = createAsyncThunk<
  any[],
  { from: string; to: string; weight: number },
  { rejectValue: string }
>(
  'app/fetchCourierServices',
  async ({ from, to, weight }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/couriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, weight }),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return rejectWithValue('Failed to fetch courier services');
      }
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Async thunk for creating booking
export const createBooking = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>(
  'app/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return rejectWithValue(data.error || 'Booking failed');
      }
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);
