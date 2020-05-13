import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Angles = {
  pitch: number;
  yaw: number;
  roll: number;
};

type State = {
  eulerAngles?: Angles;
};

const initialState: State = {
  eulerAngles: undefined,
};

export const headpose = createSlice({
  name: 'headpose',
  initialState,
  reducers: {
    updateEulerAngles: (
      state,
      action: PayloadAction<NonNullable<State['eulerAngles']>>
    ) => ({
      ...state,
      eulerAngles: action.payload,
    }),
  },
});
