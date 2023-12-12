import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";


const initialState = {
  user: null as UserState | null,
  // Add other state properties as needed
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
