import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { messagesEndpoints } from "./endpoints/messagesEndpoint";

export const MessagesApi = createApi({
  reducerPath: "MessagesApi",
  refetchOnFocus: true,
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
  endpoints: messagesEndpoints,
});

export const {
  useFetchAllMessagesQuery,
  useFetchMessagesByConversationIdQuery,
  useSendMessageMutation,
  useSendFileMutation,
  useDeleteMessageMutation,
  useDeleteConversationMutation,
} = MessagesApi;
