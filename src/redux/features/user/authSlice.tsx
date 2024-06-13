import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

const initialState = {
  user: null as UserState | null,
  selectedTab: "chats",
  // Add other state properties as needed
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
    },
    setTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setAuth, setTab } = authSlice.actions;
export default authSlice.reducer;
