// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Call {
  isReceivedCall: boolean;
  from: string;
  username: string;
  roomId: string;
  userToCall: string;
  signal: any;
}

interface CallState {
  call: Call | null;
}

const initialState: CallState = {
  call: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action: PayloadAction<Call | null>) => {
      state.call = action.payload;
    },
  },
});

export const { setCall } = callSlice.actions;
export default callSlice.reducer;
