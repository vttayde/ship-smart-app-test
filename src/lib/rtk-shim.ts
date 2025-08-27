/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal local shim for @reduxjs/toolkit to unblock build when real package cannot install.
// DO NOT USE IN PRODUCTION. Replace with real @reduxjs/toolkit ASAP.

export interface Action<Payload = unknown> { type: string; payload?: Payload; error?: unknown; meta?: unknown }
export type Reducer<S = any, A extends Action = Action> = (state: S | undefined, action: A) => S;

export function configureStore({ reducer }: { reducer: Record<string, Reducer<any>> | Reducer<any> }) {
  let currentState = typeof reducer === 'function' ? (reducer as Reducer<any>)(undefined, { type: '@@INIT' }) : Object.keys(reducer).reduce((acc: Record<string, unknown>, key) => {
    acc[key] = (reducer as Record<string, Reducer<any>>)[key](undefined, { type: '@@INIT' });
    return acc;
  }, {} as Record<string, unknown>);
  const listeners: Array<() => void> = [];
  function getState() { return currentState; }
  function dispatch(action: Action) {
    if (typeof reducer === 'function') {
      currentState = reducer(currentState, action);
    } else {
      const nextState: Record<string, unknown> = {};
      for (const key of Object.keys(reducer)) {
        nextState[key] = (reducer as Record<string, Reducer<any>>)[key]((currentState as any)[key], action);
      }
      currentState = nextState;
    }
    listeners.forEach(l => l());
    return action;
  }
  function subscribe(listener: () => void) { listeners.push(listener); return () => { const i = listeners.indexOf(listener); if (i>=0) listeners.splice(i,1); }; }
  return { dispatch, getState, subscribe };
}

interface CreateSliceOptions<S> { name: string; initialState: S; reducers: Record<string, (state: S, action: Action<any>) => void>; extraReducers?: (builder: any) => void }

export function createSlice<S>({ name, initialState, reducers }: CreateSliceOptions<S>) {
  const actions: Record<string, (payload?: unknown) => Action> = {};
  const caseReducers = reducers;
  for (const key of Object.keys(caseReducers)) {
    const type = `${name}/${key}`;
    actions[key] = (payload?: unknown) => ({ type, payload });
  }
  const reducer: Reducer<S> = (state = initialState, action) => {
    const key = action.type.replace(name + '/', '');
    const fn = (caseReducers as Record<string, (s: S, a: Action) => void>)[key];
    if (fn) {
      // naive immutable update via shallow clone (no Immer semantics)
      const draft: S = Array.isArray(state)
        ? ([...(state as unknown as unknown[])] as unknown as S)
        : ({ ...(state as unknown as Record<string, unknown>) } as S);
      fn(draft, action);
      return draft;
    }
    return state;
  };
  return { name, reducer, actions };
}

export type PayloadAction<T> = Action<T>;

export function combineReducers(reducers: Record<string, Reducer<any>>) {
  return (state: Record<string, unknown> = {}, action: Action) => {
    const next: Record<string, unknown> = {};
    for (const key of Object.keys(reducers)) {
      next[key] = reducers[key](state[key], action);
    }
    return next;
  };
}

// Extremely small createAsyncThunk shim
export function createAsyncThunk<Returned = any, ThunkArg = any>(typePrefix: string, payloadCreator: (arg: ThunkArg, helpers: { rejectWithValue: (v: unknown) => unknown }) => Promise<Returned> | Returned) {
  const pending = (arg: ThunkArg) => ({ type: typePrefix + '/pending', meta: { arg } });
  const fulfilled = (arg: ThunkArg, result: Returned) => ({ type: typePrefix + '/fulfilled', payload: result, meta: { arg } });
  const rejected = (arg: ThunkArg, error: unknown) => ({ type: typePrefix + '/rejected', error, meta: { arg } });
  const actionCreator: any = (arg: ThunkArg) => async (dispatch: any) => {
    dispatch(pending(arg));
    try {
      const res = await payloadCreator(arg, { rejectWithValue: (v) => v });
      dispatch(fulfilled(arg, res as Returned));
      return { payload: res };
    } catch (e) {
      dispatch(rejected(arg, e));
      return { error: e };
    }
  };
  actionCreator.pending = pending;
  actionCreator.fulfilled = fulfilled;
  actionCreator.rejected = rejected;
  return actionCreator;
}
