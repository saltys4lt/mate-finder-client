import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

interface QueryParams {
  teamId: number;
  name: string;
}

export default createAsyncThunk('usersReducer/deleteTeam', async ({ teamId, name }: QueryParams, { rejectWithValue }) => {
  const response = axios
    .delete<number>(`${baseUrl}/deleteTeam`, {
      withCredentials: true,
      params: {
        teamId,
        name,
      },
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
