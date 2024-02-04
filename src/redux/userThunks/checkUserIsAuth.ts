import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientUser from '../../types/ClientUser';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/checkUserIsAuth', async (_, { rejectWithValue }) => {
  const response = await axios
    .get<ClientUser>(`${baseUrl}/check`, { withCredentials: true })
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
