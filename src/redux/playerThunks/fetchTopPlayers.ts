import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Player from '../../types/Player';
const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/fetchTopPlayers', async (_, { rejectWithValue }) => {
  const response = axios
    .get<Player[]>(`${baseUrl}/topPlayers`, {
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
