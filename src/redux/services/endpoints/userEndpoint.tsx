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
type MyReducerPath = "UserApi";

export const userEndpoints = (
  builder: EndpointBuilder<MyApiBaseQuery, MyTagTypes, MyReducerPath>
) => ({
  passwordReset: builder.mutation<UserState, { email: any }>({
    query: (body: unknown) => ({
      url: "/account/forgot-password",
      method: "POST",
      body,
    }),
  }),
  passwordResetConfirm: builder.mutation<
    UserState,
    {
      token: string;
      data: any;
    }
  >({
    query: ({ token, data }: { token: string; data: any }) => ({
      url: `/account/reset-password/${token}`,
      method: "POST",
      body: data,
    }),
  }),
  fetchAllUsers: builder.query<UserState[], null>({
    query: () => "/users",
  }),
  fetchAllFriends: builder.query<UserState[], null>({
    query: () => "/users/friends",
  }),
  fetchUserById: builder.query<UserState, { id: string }>({
    query: ({ id }: { id: string }) => `users/${id}`,
  }),
  updateUser: builder.mutation<UserState, { id: string; data: any }>({
    query: ({ id, data }: { id: string; data: any }) => ({
      url: `/users/${id}/update-user`,
      method: "PATCH",
      body: data,
    }),
  }),
  deleteUser: builder.mutation<UserState, Partial<UserState>>({
    query: (body: unknown) => ({
      url: "/users",
      method: "DELETE",
      body,
    }),
  }),
  searchuser: builder.mutation<UserState[], { identifier: string }>({
    query: (body: unknown) => ({
      url: "/users/search",
      method: "POST",
      body,
    }),
  }),
});
