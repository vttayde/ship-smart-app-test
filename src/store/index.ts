import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import bookingReducer from './slices/bookingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  booking: bookingReducer,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const store = configureStore({ reducer: rootReducer as any });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RootState = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = any;
export { useSelector, useDispatch };
