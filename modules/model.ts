import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  backgroundColor: number;
};

const initialState: State = {
  backgroundColor: 0xffffff,
};

export const model = createSlice({
  name: 'model',
  initialState,
  reducers: {
    updateBackgroundColor: (
      state,
      action: PayloadAction<State['backgroundColor']>
    ) => ({
      ...state,
      backgroundColor: action.payload,
    }),
  },
});
