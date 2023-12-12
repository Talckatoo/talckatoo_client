import { configureStore, ThunkMiddleware, AnyAction } from "@reduxjs/toolkit";
import userSliceReducer from "./features/user/userSlice";
import authSliceReducer from "./features/user/authSlice";
import requestSliceReducer from "./features/user/requestSlice";

import { UserApi } from "./services/UserApi";
import { AuthApi } from "./services/AuthApi";

// Explicitly typing the middleware array
const middleware: Array<ThunkMiddleware<unknown, AnyAction>> = [
  UserApi.middleware as ThunkMiddleware<unknown, AnyAction>,
  AuthApi.middleware as ThunkMiddleware<unknown, AnyAction>,
];

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    request: requestSliceReducer,
    auth: authSliceReducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  } as any,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware), // used our typed middleware array
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
