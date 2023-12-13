import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userEndpoints } from "./endpoints/userEndpoint";

export const UserApi = createApi({
  reducerPath: "UserApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL as string,
    prepareHeaders: async (headers) => {
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
