import {
  configureStore,
  ThunkMiddleware,
  AnyAction,
  combineReducers,
} from "@reduxjs/toolkit";
import userSliceReducer from "./features/user/userSlice";
import authSliceReducer from "./features/user/authSlice";
import requestSliceReducer from "./features/user/requestSlice";
import conversationSliceReducer from "./features/conversation/conversationSlice";
import messagesSliceReducer from "./features/messages/messageSlice";

import { UserApi } from "./services/UserApi";
import { AuthApi } from "./services/AuthApi";

// persist store

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/lib/persistReducer";
import { MessagesApi } from "./services/MessagesApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "conversation", "messages"],
};

export interface RootState extends PersistPartial {
  messages: any;
  user: any;
  request: any;
  auth: any;
  conversation: any;
  [UserApi.reducerPath]: any;
  [AuthApi.reducerPath]: any;
  [MessagesApi.reducerPath]: any;
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userSliceReducer,
    request: requestSliceReducer,
    auth: authSliceReducer,
    conversation: conversationSliceReducer,
    messages: messagesSliceReducer,

    [UserApi.reducerPath]: UserApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [MessagesApi.reducerPath]: MessagesApi.reducer,
  }) as any
);

// Explicitly typing the middleware array
const middleware: Array<ThunkMiddleware<unknown, AnyAction>> = [
  UserApi.middleware as ThunkMiddleware<unknown, AnyAction>,
  AuthApi.middleware as ThunkMiddleware<unknown, AnyAction>,
  MessagesApi.middleware as ThunkMiddleware<unknown, AnyAction>,
];

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(middleware),
});

// persist store
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
