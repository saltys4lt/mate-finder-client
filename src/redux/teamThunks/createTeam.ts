import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Team from '../../types/Team';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/createTeam', async (data: Team, { rejectWithValue }) => {
  const response = axios
    .post<Team>(`${baseUrl}/createTeam/${data.userId}`, data, { withCredentials: true })
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
