import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;
type param = string | undefined;
export default createAsyncThunk('adminReducer/fetchAllMaps', async (searchQuery: param, { rejectWithValue }) => {
  const response = axios
    .get(`${baseUrl}/fetchAllMaps`, {
      withCredentials: true,
      params: {
        searchQuery,
      },
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
