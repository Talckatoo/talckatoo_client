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
  fetchAllUsers: builder.query<UserState[], null>({
    query: () => "users",
  }),
  fetchUserById: builder.query<UserState, { id: string }>({
    query: ({ id }: { id: string }) => `users/${id}`,
  }),
  updateUser: builder.mutation<
    UserState,
    { id: string; data: Partial<UserState> }
  >({
    query: ({ id, data }: { id: string; data: Partial<UserState> }) => ({
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
});