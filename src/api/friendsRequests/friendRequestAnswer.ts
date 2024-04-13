import axios from 'axios';
const URL = import.meta.env.VITE_BASE_URL;

export const friendRequestAnswer = async (request: { accept: boolean; requestId: number }) => {
  await axios.post(`${URL}/friendRequestAction`, request).then((res) => {
    return res.data;
  });
};
