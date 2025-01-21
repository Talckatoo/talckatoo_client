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

interface HandleCall {
  video?: boolean;
  audio?: boolean;
  remoteAudio?: boolean;
}

interface CallState {
  call: Call | null;
  handleCall: HandleCall;
}

const initialState: CallState = {
  call: null,
  handleCall: {
    video: true,
    audio: true,
    remoteAudio: true,
  },
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action: PayloadAction<Call | null>) => {
      state.call = action.payload;
    },
    clearCall: (state) => {
      state.call = null;
    },
    setHandleCall: (state, action: PayloadAction<HandleCall>) => {
      state.handleCall = {
        ...state.handleCall,
        ...action.payload,
      };
    },
    setRemoteAudio: (state, action: PayloadAction<boolean>) => {
      state.handleCall.remoteAudio = action.payload;
    },

  },
});

export const { setCall, clearCall, setHandleCall, setRemoteAudio } = callSlice.actions;
export default callSlice.reducer;
