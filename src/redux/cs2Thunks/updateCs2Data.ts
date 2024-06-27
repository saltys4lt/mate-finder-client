import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cs2Data from '../../types/Cs2Data';
import { RootState } from '..';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/updateCs2Data', async (steamId: string, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const id: number = state.userReducer.user?.id as number;
  const response = axios
    .patch<Cs2Data>(`${baseUrl}/updateCs2`, '', {
      params: {
        steamId,
        id,
      },
      withCredentials: true,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message ?? 'Unknown error');
      } else if (error instanceof Error) {
        return rejectWithValue(error.message ?? 'Unknown error');
      } else {
        return rejectWithValue('Unknown error');
      }
    });
  return response;
});
