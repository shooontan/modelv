import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer, RootState } from '@/modules';

const middlewares = [...getDefaultMiddleware<RootState>()] as const;

export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
