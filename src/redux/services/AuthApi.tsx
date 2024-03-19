import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authEndpoints } from "./endpoints/authEndpoint";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL as string,
  }),

  endpoints: authEndpoints,
});

export const { useLoginAuthMutation, useRegisterAuthMutation, useDeleteAccountMutation } = AuthApi;
