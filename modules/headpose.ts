import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Angles = {
  pitch: number;
  yaw: number;
  roll: number;
};

type Points = {
  x: number;
  y: number;
};

type State = {
  eulerAngles?: Angles;
  projectPoints?: {
    nose: Points;
    x: Points;
    y: Points;
    z: Points;
  };
};

const initialState: State = {};

export const headpose = createSlice({
  name: 'headpose',
  initialState,
  reducers: {
    update: (
      state,
      action: PayloadAction<{
        eulerAngles: NonNullable<State['eulerAngles']>;
        projectPoints: NonNullable<State['projectPoints']>;
      }>
    ) => ({
      ...state,
      ...action.payload,
    }),
    updateEulerAngles: (
      state,
      action: PayloadAction<NonNullable<State['eulerAngles']>>
    ) => ({
      ...state,
      eulerAngles: action.payload,
    }),
    updateProjectPoints: (
      state,
      action: PayloadAction<NonNullable<State['projectPoints']>>
    ) => ({
      ...state,
      projectPoints: action.payload,
    }),
  },
});
