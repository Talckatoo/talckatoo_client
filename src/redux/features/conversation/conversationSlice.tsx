// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Conversation {
  conversationId?: string | null;
  selectedId?: string | null;
  language?: string | null;
}

export interface ConversationState {
  conversation: Conversation | null;
}

const initialState: ConversationState = {
  conversation: null,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
