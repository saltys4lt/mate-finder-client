import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chat } from '../../types/Chat';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('chatReducer/fetchChats', async (_, { rejectWithValue }) => {
  const response = await axios
    .get<Chat[]>(`${baseUrl}/fetchChats`, { withCredentials: true })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message ?? 'Unknown error');
      }
    });
  return response;
});
