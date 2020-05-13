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
};

const initialState: State = {
  points: {},
};

export const landmark = createSlice({
  name: 'landmark',
  initialState,
  reducers: {
    updatePoints: (state, action: PayloadAction<Points>) => ({
      ...state,
      points: action.payload,
    }),
  },
});
