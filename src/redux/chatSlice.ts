import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../types/Chat';
import { Message } from '../types/Message';

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
      if (!state.chats.find((chat) => chat.id === action.payload.id)) {
        state.chats = [...state.chats, action.payload];
      }
    },
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    getMessage(state, action: PayloadAction<Message>) {
      const newMessage = action.payload;
      console.log(newMessage.chatId);
      console.log(state.currentChat?.id);

      if (newMessage.chatId === state.currentChat?.id) {
        state.currentChat.messages.push(newMessage);
      }
      if (state.chats.length !== 0) {
        state.chats = state.chats.map((chat) =>
          chat.id === newMessage.chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat,
        );
      }
    },
    getChat(state, action: PayloadAction<Chat>) {
      state.chats = [...state.chats, action.payload];
    },
  },
});

export const { setChats, setCurrentChat, getMessage, getChat } = chatSlice.actions;

export default chatSlice.reducer;
