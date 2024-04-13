import axios from 'axios';
import { FriendRequest } from '../../types/friendRequest';
const URL = import.meta.env.VITE_BASE_URL;

export const sendFriendRequest = async (request: { fromUserId: number; toUserId: number }): Promise<FriendRequest[]> => {
  const data = await axios.post(`${URL}/friendRequest`, request, { withCredentials: true }).then((res) => {
    return res.data;
  });
  return data;
};
