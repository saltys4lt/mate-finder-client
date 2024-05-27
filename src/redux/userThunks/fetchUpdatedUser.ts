import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientUser from '../../types/ClientUser';
import axios, { CancelToken } from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const fetchUpdatedUser = createAsyncThunk(
  'usersReducer/fetchUpdatedUser',
  async ({ id, cancelToken }: { id: number; cancelToken: CancelToken }, { dispatch }) => {
    const subscribe = async (): Promise<ClientUser | undefined> => {
      try {
        const response = await axios.get<ClientUser>(`${baseUrl}/fetchUpdatedUser`, {
          withCredentials: true,
          cancelToken,
          params: { id },
        });
        if (response.data) {
          dispatch(fetchUpdatedUser({ id, cancelToken }));
          return response.data;
        }
      } catch (e) {
        if (!axios.isCancel(e)) {
          setTimeout(() => {
            dispatch(fetchUpdatedUser({ id, cancelToken }));
          }, 500);
        }
        throw e;
      }
    };
    return await subscribe();
  },
);

export default fetchUpdatedUser;
