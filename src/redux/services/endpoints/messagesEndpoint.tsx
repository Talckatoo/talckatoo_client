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
    { userId: string; conversationId: string }
  >({
    query: ({
      userId,
      conversationId,
    }: {
      userId: string;
      conversationId: string;
    }) => `/users/${userId}/conversations/${conversationId}`,
  }),
  // send message using socket
  sendMessage: builder.mutation<Message, any>({
    query: (body: any) => ({
      url: "/messages",
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
