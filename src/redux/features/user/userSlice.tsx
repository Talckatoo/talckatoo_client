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
  recipient?: any;
}

const initialState: UserState = {
  _id: null,
  token: null,
  user: null,
  users: [],
  recipient: null,
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
    setRecipient: (state, action: PayloadAction<UserState | null>) => {
      state.recipient = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setUser, setUsers, setRecipient } = userSlice.actions;
export default userSlice.reducer;
