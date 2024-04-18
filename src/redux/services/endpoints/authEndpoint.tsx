import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { UserState } from "../../features/user/userSlice";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

type MyApiBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;
type MyTagTypes = string;
type MyReducerPath = "AuthApi";
export const authEndpoints = (
  builder: EndpointBuilder<MyApiBaseQuery, MyTagTypes, MyReducerPath>
) => ({
  deleteAccount: builder.mutation<UserState, { email: string }>({
    query: ({ email }: { email: string }) => ({
      url: "/account/delete-account",
      method: "POST",
      body: { email },
    }),
  }),
  loginAuth: builder.mutation<UserState, { email: string; password: string }>({
    query: ({ email, password }: { email: string; password: string }) => ({
      url: "/account/log-in",
      method: "POST",
      body: { email, password },
    }),
  }),
  registerAuth: builder.mutation<UserState, { userName: string, password: string, email: string, language: string }>({
    query: ({
      userName,
      email,
      password,
      language,
    }: {
      userName: string;
      email: string;
      password: string;
      language: string;
    }) => ({
      url: "/account/sign-up",
      method: "POST",
      body: { userName, email, password, language },
    }),
  }),
});
