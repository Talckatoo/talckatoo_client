// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: any;
  email: string;
  userId: string;
  userName: string;
  profileImage?: {
    url: string;
  };
  language: string;
  welcome: string;
}

export interface UserState {
  _id: any;
  token: string | null;
  user: any;
  users?: string[];
}

const initialState: UserState = {
  _id: null,
  token: null,
  user: null,
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState | null>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
