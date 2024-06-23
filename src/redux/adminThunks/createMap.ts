import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('adminReducer/createMap', async (name: string, { rejectWithValue }) => {
  console.log(name);
  const response = axios
    .post(
      `${baseUrl}/createMap`,
      { name },
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
