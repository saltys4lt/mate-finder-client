import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../types/Chat';

interface ChatInitialState {
  currentChat: Chat | null;
  chats: Chat[] | [];
}

const initialState: ChatInitialState = {
  currentChat: null,
  chats: [],
};

const chatSlice = createSlice({
  name: 'chatReducer',
  initialState,

  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat>) {
      state.currentChat = action.payload;
    },
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
  },
});

export const { setChats, setCurrentChat } = chatSlice.actions;

export default chatSlice.reducer;
