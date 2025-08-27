/* Temporary stub for 'react-redux' to keep app compiling until dependency installs.
   Remove when real package is available. */
import { type ReactNode } from 'react';

// Very small in-memory mock store
interface MockState {
  booking: { isLoading: boolean };
  [key: string]: unknown;
}

let state: MockState = { booking: { isLoading: false } };
const listeners: Array<() => void> = [];

export interface ProviderProps { store?: unknown; children: ReactNode }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Provider({ children }: ProviderProps) { return children as unknown as any; }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDispatch<T = unknown>() {
  // Accept thunk-like functions or plain objects; no real reducers applied.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (action: any): any => {
    if (typeof action === 'function') {
      return action(() => {}, () => state);
    }
    // naive detect booking loading toggles
    if (action && typeof action.type === 'string') {
      if (action.type.endsWith('/setLoading')) {
        state = { ...state, booking: { ...state.booking, isLoading: action.payload } };
        listeners.forEach(l => l());
      }
    }
    return action;
  };
}

export function useSelector<TSelected = unknown>(selector: (state: MockState) => TSelected): TSelected {
  return selector(state);
}

// Optional subscribe for components wanting manual subscription (not used currently)
export function __subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
}
