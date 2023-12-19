// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  _id: string;
  message?: string | null;
  audioURL?: string;
  sender: string | null;
  voiceNote?: any;
  unread?: string;
  createdAt?: string | null;
  conversation?: any;
}

export interface MessageState {
  messages: Message[];
  arrivalMessages: Message[];
}

const initialState: MessageState = {
  messages: [],
  arrivalMessages: [],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    deleteMessage: (state, action: PayloadAction<Message>) => {
      state.messages.filter((message) => message._id !== action.payload._id);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      state.messages.map((message) => {
        if (message._id === action.payload._id) {
          message.message = action.payload.message;
        }
      });
    },
    updateMessagesFromBuffer: (state) => {
      // Add arrival messages to the main message array and clear the buffer
      state.messages.push(...state.arrivalMessages);
      state.arrivalMessages = [];
      // Sort messages based on timestamp or ordering criteria
      state.messages.sort((a, b) =>
        a.createdAt && b.createdAt ? a.createdAt.localeCompare(b.createdAt) : 0
      );
    },
  },
});

export const {
  setMessages,
  addMessage,
  deleteMessage,
  updateMessage,
  updateMessagesFromBuffer,
} = messageSlice.actions;

export default messageSlice.reducer;
