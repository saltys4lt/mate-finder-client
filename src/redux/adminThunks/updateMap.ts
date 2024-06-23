import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

interface params {
  id: number;
  name: string;
}

export default createAsyncThunk('adminReducer/updateMap', async ({ id, name }: params, { rejectWithValue }) => {
  const response = axios
    .put(
      `${baseUrl}/updateMap`,
      { name, id },
      {
        withCredentials: true,
      },
    )
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
