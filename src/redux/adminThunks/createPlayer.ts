import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AdminPlayer } from '../../types/AdminPlayer';
const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('adminReducer/createPlayer', async (player: AdminPlayer, { rejectWithValue }) => {
  const response = axios
    .post<AdminPlayer[]>(`${baseUrl}/createPlayer`, player, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data ?? 'Unknown error');
      } else if (error instanceof Error) {
        return rejectWithValue(error.message ?? 'Unknown error');
      } else {
        return rejectWithValue('Unknown error');
      }
    });

  return response;
});
