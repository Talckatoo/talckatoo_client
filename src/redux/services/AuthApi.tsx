import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "./config";
import { authEndpoints } from "./endpoints/authEndpoint";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.API_URL,
    credentials: "include",
  }),
  endpoints: authEndpoints,
});

export const { useLoginAuthMutation, useRegisterAuthMutation } = AuthApi;
