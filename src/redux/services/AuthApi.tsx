import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authEndpoints } from "./endpoints/authEndpoint";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL as string || "https://talckatoo-250985c83f7c.herokuapp.com/api/v1",
  }),

  endpoints: authEndpoints,
});

export const { useLoginAuthMutation, useRegisterAuthMutation, useDeleteAccountMutation } = AuthApi;
