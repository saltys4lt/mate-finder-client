import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Team from '../../types/Team';
import { Membership } from '../../types/Membership';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/kickPlayer', async (memberId: number, { rejectWithValue }) => {
  const response = axios
    .delete<Membership>(`${baseUrl}/kickPlayer`, { withCredentials: true, params: { memberId } })
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
