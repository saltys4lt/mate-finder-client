import { createAsyncThunk } from '@reduxjs/toolkit';
import User from '../../types/User';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/createUser', async (data: User, { rejectWithValue }) => {
  const response = axios
    .post<User>(`${baseUrl}/registration`, data)
    .then((res) => {
      return res.data.nickname;
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
