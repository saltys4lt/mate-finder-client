import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';
import { PlayersWithPages } from '../../types/PlayersWithPages';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('adminReducer/fetchAllPlayers', async (_, { rejectWithValue, getState }) => {
  const state: RootState = getState() as RootState;
  const { filter, sort, cs2_data, desc, user_avatar, gender, currentPage, searchQuery, searchFilter } = state.adminReducer;

  const response = axios
    .get<PlayersWithPages>(`${baseUrl}/fetchAllPlayers`, {
      params: {
        filter,
        sort,
        cs2_data,
        desc,
        user_avatar,
        gender,
        page: currentPage,
        searchFilter,
        searchQuery,
      },
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
