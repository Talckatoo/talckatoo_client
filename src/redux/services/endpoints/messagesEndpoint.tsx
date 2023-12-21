import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { Message } from "../../features/messages/messageSlice";

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
type MyReducerPath = "MessagesApi";

export const messagesEndpoints = (
  builder: EndpointBuilder<MyApiBaseQuery, MyTagTypes, MyReducerPath>
) => ({
  fetchAllMessages: builder.query<any, null>({
    query: () => "/messages",
  }),
  fetchMessagesByConversationId: builder.query<
    any,
    { conversationId: string; page: number; limit: number; userId: string }
  >({
    query: ({
      userId,
      conversationId,
      page,
      limit,
    }: {
      userId: string;
      conversationId: string;
      page: number;
      limit: number;
    }) =>
      `/users/${userId}/conversations/${conversationId}?page=${page}&limit=${limit}`,
  }),
  // send message using socket
  sendMessage: builder.mutation<Message, any>({
    query: (body: any) => ({
      url: "/messages",
      method: "POST",
      body,
    }),
  }),
  // send Audio accept formData
  sendAudio: builder.mutation<Message, FormData>({
    query: (body: any) => ({
      url: "/messages/voice-note",
      method: "POST",
      body,
    }),
  }),
  // send message using socket
  sendFile: builder.mutation<Message, any>({
    query: (body: any) => ({
      url: "/messages/file",
      method: "POST",
      body,
    }),
  }),

  deleteMessage: builder.mutation<Message, any>({
    query: (body: any) => ({
      url: "/messages",
      method: "DELETE",
      body,
    }),
  }),

  deleteConversation: builder.mutation<Message, any>({
    query: (body: any) => ({
      url: "/messages/conversation",
      method: "DELETE",
      body,
    }),
  }),
});
