import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authEndpoints } from "./endpoints/authEndpoint";

console.log('AuthApi', import.meta.env.VITE_BASE_URL.API_URL);

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL.API_URL,
    credentials: "include",
  }),
  endpoints: authEndpoints,
});

export const { useLoginAuthMutation, useRegisterAuthMutation } = AuthApi;
