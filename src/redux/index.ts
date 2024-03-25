import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userSlice from './userSlice';
import modalSlice from './modalSlice';
import playerSlice from './playerSlice';
import chatSlice from './chatSlice';

export const store = configureStore({
  reducer: {
    userReducer: userSlice,
    modalReducer: modalSlice,
    playerReducer: playerSlice,
    chatReducer: chatSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
