import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import usersSlice from './usersSlice';
import modalSlice from './modalSlice';
export const store = configureStore({
  reducer: {
    userReducer: usersSlice,
    modalReducer: modalSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
