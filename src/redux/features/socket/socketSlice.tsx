// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  onlineFriends: String[];
}

const initialState: SocketState = {
  onlineFriends: [],
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineFriends: (state, action: PayloadAction<String[]>) => {
      state.onlineFriends = action.payload;
    },
  },
});

export const { setOnlineFriends } = socketSlice.actions;

export default socketSlice.reducer;
