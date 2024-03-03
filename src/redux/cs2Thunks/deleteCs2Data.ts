import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/deleteCs2data', async (_, { rejectWithValue }) => {
  const response = await axios
    .delete<string>(`${baseUrl}/deleteCs2data`, { withCredentials: true })
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
