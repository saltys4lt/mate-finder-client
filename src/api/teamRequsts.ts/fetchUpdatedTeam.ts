import axios, { CancelToken } from 'axios';
import Team from '../../types/Team';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchUpdatedTeam = async (id: number, setTeam: (data: Team) => void, cancelToken: CancelToken) => {
  const subscribe = async () => {
    try {
      const { data } = await axios.get<Team>(`${baseUrl}/updatedTeam/${id}`, { withCredentials: true, cancelToken });
      if (data) {
        setTeam(data);
        await subscribe();
      }
    } catch (e) {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };
  subscribe();
};
