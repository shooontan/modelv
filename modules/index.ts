import { combineReducers } from '@reduxjs/toolkit';
import { headpose } from './headpose';
import { landmark } from './landmark';
import { model } from './model';

export { headpose, landmark, model };

export const rootReducer = combineReducers({
  headpose: headpose.reducer,
  landmark: landmark.reducer,
  model: model.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
