// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Call {
  call: null;
}

export interface CallState {
  call: Call | null;
}

const initialState: CallState = {
  call: null,
};

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action: PayloadAction<Call>) => {
      state.call = action.payload;
    },
  },
});

export const { setCall } = callSlice.actions;

export default callSlice.reducer;
