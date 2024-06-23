import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AdminPlayer } from '../../types/AdminPlayer';
const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('adminReducer/updatePlayerById', async (player: AdminPlayer, { rejectWithValue }) => {
  const response = axios
    .patch<AdminPlayer[]>(`${baseUrl}/updatePlayerById`, { ...player, id: undefined, cs2_data: undefined } as AdminPlayer, {
      params: {
        id: player.id,
      },
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
