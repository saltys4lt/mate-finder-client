import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { UserFriendsData } from '../../types/UserFriendsData';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/friendsData', async (_, { rejectWithValue }) => {
  const response = axios
    .get<UserFriendsData>(`${baseUrl}/friendsData`, {
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
