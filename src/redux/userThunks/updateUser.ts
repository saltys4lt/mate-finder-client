import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientUser from '../../types/ClientUser';
import axios from 'axios';
import UpdatedUserData from '../../types/UpdatedUserData';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/updateUser', async (data: UpdatedUserData, { rejectWithValue }) => {
  const response = axios
    .patch<ClientUser>(`${baseUrl}/updateUser`, data, {
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
