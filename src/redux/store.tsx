import {
  configureStore,
  ThunkMiddleware,
  AnyAction,
  combineReducers,
} from "@reduxjs/toolkit";
import userSliceReducer from "./features/user/userSlice";
import authSliceReducer from "./features/user/authSlice";
import requestSliceReducer from "./features/user/requestSlice";

import { UserApi } from "./services/UserApi";
import { AuthApi } from "./services/AuthApi";

// persist store

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistPartial } from "redux-persist/lib/persistReducer";

const persistConfig = {
  key: "root",
  storage,
};

export interface RootState extends PersistPartial {
  user: any;
  request: any;
  auth: any;
  [UserApi.reducerPath]: any;
  [AuthApi.reducerPath]: any;
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userSliceReducer,
    request: requestSliceReducer,
    auth: authSliceReducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  }) as any
);

// Explicitly typing the middleware array
const middleware: Array<ThunkMiddleware<unknown, AnyAction>> = [
  UserApi.middleware as ThunkMiddleware<unknown, AnyAction>,
  AuthApi.middleware as ThunkMiddleware<unknown, AnyAction>,
];

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware), // used our typed middleware array
});

// persist store
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
