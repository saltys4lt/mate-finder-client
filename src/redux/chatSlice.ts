import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../types/Chat';
import { Message } from '../types/Message';
import fetchChats from './chatThunks/fetchChats';
import { ioSocket } from '../api/webSockets/socket';

interface ChatInitialState {
  currentChat: Chat | null;
  chats: Chat[] | [];
  fetchChatsStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
}

const initialState: ChatInitialState = {
  fetchChatsStatus: 'idle',
  currentChat: null,
  chats: [],
};

const chatSlice = createSlice({
  name: 'chatReducer',
  initialState,

  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat>) {
      state.currentChat = action.payload;

      if (!state.chats.find((chat) => chat.roomId === action.payload.roomId)) {
        state.chats = [...state.chats, action.payload];
      }
    },
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    getMessage(state, action: PayloadAction<Message>) {
      const newMessage = action.payload;
      if (newMessage.roomId === state.currentChat?.roomId) {
        state.currentChat.messages.push(newMessage);
      }
      if (state.chats.length !== 0) {
        state.chats = state.chats.map((chat) =>
          chat.roomId === newMessage.roomId ? { ...chat, messages: [...chat.messages, newMessage] } : chat,
        );
      }
    },
    getChat(state, action: PayloadAction<Chat>) {
      const newChat = action.payload;

      if (newChat.members[0].id.toString() + newChat.members[1].id.toString() === state.currentChat?.roomId) {
        const newRoomIdRevert: string = newChat.members[0].id.toString() + newChat.members[1].id.toString();

        state.currentChat = newChat;
        state.chats = state.chats.map((chat) => (chat.roomId === newRoomIdRevert ? newChat : chat));
        ioSocket.emit('readMessage', newChat.messages[0]);
      } else if (newChat.members[1].id.toString() + newChat.members[0].id.toString() === state.currentChat?.roomId) {
        const newRoomIdRevert: string = newChat.members[1].id.toString() + newChat.members[0].id.toString();

        state.currentChat = newChat;
        state.chats = state.chats.map((chat) => (chat.roomId === newRoomIdRevert ? newChat : chat));
        ioSocket.emit('readMessage', newChat.messages[0]);
      } else if (!state.chats.find((chat) => chat.roomId === newChat.roomId)) {
        state.chats = [...state.chats, newChat];
      }
    },

    updateMessage(state, action: PayloadAction<Message>) {
      const newMessage = action.payload;
      if (newMessage.roomId === state.currentChat?.roomId) {
        state.currentChat.messages = state.currentChat.messages.map((message) => (message.id === newMessage.id ? newMessage : message));
      }

      state.chats = state.chats.map((chat) =>
        chat.roomId === newMessage.roomId
          ? { ...chat, messages: chat.messages.map((message) => (message.id === newMessage.id ? newMessage : message)) }
          : chat,
      );
    },

    updateChatMessages(state, action: PayloadAction<Message[]>) {
      const checkedMessages = action.payload;
      const roomId = checkedMessages[0].roomId;
      if (state.currentChat?.messages) {
        const updatedChatMessages: Message[] = state.currentChat?.messages.map((message) => {
          const foundMessage = checkedMessages.find((checkedMessage) => checkedMessage.id === message.id);
          if (foundMessage) {
            return foundMessage;
          }
          return message;
        });
        state.chats = state.chats.map((chat) => (chat.roomId === roomId ? { ...chat, messages: updatedChatMessages } : chat));
        state.currentChat = { ...state.currentChat, messages: updatedChatMessages };
      }
    },

    leaveTeamChat(state, action: PayloadAction<number>) {
      state.chats = state.chats.filter((chat) => chat.id === action.payload);
    },
    resetChats(state) {
      state.fetchChatsStatus = 'idle';
      state.currentChat = null;
      state.chats = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.fetchChatsStatus = 'pending';
    });
    builder.addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[] | undefined>) => {
      state.fetchChatsStatus = 'fulfilled';
      if (action.payload) state.chats = action.payload;
    });
    builder.addCase(fetchChats.rejected, (state) => {
      state.fetchChatsStatus = 'rejected';
    });
  },
});

export const { setChats, setCurrentChat, getMessage, getChat, updateChatMessages, updateMessage, resetChats, leaveTeamChat } =
  chatSlice.actions;

export default chatSlice.reducer;
