// DUCKS pattern
import {createSlice ,  PayloadAction } from '@reduxjs/toolkit';


export interface User {
    _id: string;
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
    user: User | null;
  }
  
  interface InitialState {
    user: UserState | null;
    users: string[];
  }
  
  const initialState: InitialState = {
    user: null,
    users: [],
  };

  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUserSelf: (state, action: PayloadAction<UserState | null>) => {
        state.user = action.payload;
      },
      setUsers: (state, action: PayloadAction<string[]>) => {
        state.users = action.payload;
      },
      // Add other reducers as needed
    },
  });
  
  export const { setUserSelf, setUsers } = userSlice.actions;
  export default userSlice.reducer;
    