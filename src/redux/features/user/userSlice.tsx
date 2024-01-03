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
  data: any;
}

export interface UserState {
  _id: any;
  token: string | null;
  user: any;
  users?: any;
  recipient?: any;
  data: any;
}

const initialState: UserState = {
  _id: null,
  token: null,
  user: null,
  users: {
    contactedUsers: [],
    uncontactedUsers: [],
  },
  recipient: null,
  data: null,
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
    updateContactedUserById: (state, action: PayloadAction<any>) => {
      const { from, userName, image, language } = action.payload;
      state.users.contactedUsers = state.users.contactedUsers.map(
        (user: any) => {
          if (user._id === from) {
            return {
              ...user,
              userName,
              profileImage: { url: image },
              language,
            };
          }
          return user;
        }
      );
    },
    setRecipient: (state, action: PayloadAction<UserState | null>) => {
      state.recipient = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setUser, setUsers, setRecipient, updateContactedUserById } =
  userSlice.actions;
export default userSlice.reducer;
