import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userEndpoints } from "./endpoints/userEndpoint";

export const UserApi = createApi({
  reducerPath: "UserApi",
  tagTypes: ["UserState"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL as string,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: userEndpoints,
});

export const {
  useFetchAllUsersQuery,
  useFetchAllFriendsQuery,
  useFetchAllRequestsQuery,
  useFetchUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePasswordResetMutation,
  usePasswordResetConfirmMutation,
  useSearchuserMutation,
  useAddFriendMutation,
  useActionFriendMutation,
} = UserApi;
