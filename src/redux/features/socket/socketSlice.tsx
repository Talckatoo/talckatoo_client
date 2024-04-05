// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type random = {
  randomData: any;
  conversationRandomId: string;
  isChatOpen: boolean;
  islooking: boolean;
};
export interface SocketState {
  onlineFriends: String[];
  random: random;
}

const initialState: SocketState = {
  onlineFriends: [],
  random: {
    randomData: null,
    conversationRandomId: "",
    isChatOpen: false,
    islooking: false,
  },
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineFriends: (state, action: PayloadAction<String[]>) => {
      state.onlineFriends = action.payload;
    },
    setRandom: (state, action: PayloadAction<any>) => {
      state.random = action.payload;
    },
  },
});

export const { setOnlineFriends, setRandom } = socketSlice.actions;

export default socketSlice.reducer;
