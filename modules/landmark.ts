import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Point = [number, number];

export type Points = {
  nose?: Point;
  leftEye?: Point;
  rightEye?: Point;
  leftMouth?: Point;
  rightMouth?: Point;
  upperLip?: Point;
  lowerLip?: Point;
  jaw?: Point;
  leftOutline?: Point;
  rightOutline?: Point;
};

type State = {
  points: Points;
  renderThrottle: number;
};

const initialState: State = {
  points: {},
  renderThrottle: 0,
};

export const landmark = createSlice({
  name: 'landmark',
  initialState,
  reducers: {
    updatePoints: (state, action: PayloadAction<Points>) => ({
      ...state,
      points: action.payload,
    }),
    updateRenderThrottle: (
      state,
      action: PayloadAction<State['renderThrottle']>
    ) => ({
      ...state,
      renderThrottle: action.payload,
    }),
  },
});
