import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "./config";

import { userEndpoints } from "./endpoints/userEndpoint";

export const UserApi = createApi({
  reducerPath: "UserApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.API_URL,
    prepareHeaders: async (headers, { getState }) => {
      // Replace AsyncStorage with localStorage
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: userEndpoints,
});

export const {
  useFetchAllUsersQuery,
  useFetchUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UserApi;
