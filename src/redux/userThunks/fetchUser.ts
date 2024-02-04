import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientUser from '../../types/ClientUser';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

interface IFormInput {
  password: string;
  nickname: string;
}

export default createAsyncThunk('usersReducer/fetchUser', async (data: IFormInput, { rejectWithValue }) => {
  const response = axios
    .post<ClientUser>(`${baseUrl}/login`, data, {
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
