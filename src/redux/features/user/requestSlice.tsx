import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface RequestState {
  _id: any;
}

const initialState = {
  request: null as RequestState | null,
  requests: [] as any[],
};

export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setRequest: (state, action) => {
      state.request = action.payload;
    },
    setRequests: (state, action: PayloadAction<any[]>) => {
      state.requests = action.payload;
    },
  },
});

export const { setRequest, setRequests } = requestSlice.actions;
export default requestSlice.reducer;
