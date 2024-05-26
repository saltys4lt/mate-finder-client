import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientUser from '../../types/ClientUser';
import axios, { CancelToken } from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default createAsyncThunk('usersReducer/fetchUpdatedUser', async (cancelToken: CancelToken) => {
  const subscribe = async (): Promise<any> => {
    try {
      const response = await axios.get<ClientUser>(`${baseUrl}/fetchUpdatedUser`, { withCredentials: true, cancelToken });
      if (response.data) {
        return Promise.resolve(response).then(() => subscribe());
      }
    } catch (e) {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };
  return subscribe();
});
