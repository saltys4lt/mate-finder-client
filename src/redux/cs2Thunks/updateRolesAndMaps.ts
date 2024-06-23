import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cs2Data from '../../types/Cs2Data';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/updateRolesAndMaps', async (data: Record<string, number[]>, { rejectWithValue }) => {
  const response = axios
    .patch<Cs2Data>(`${baseUrl}/updateRolesAndMaps`, data, {
      withCredentials: true,
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
