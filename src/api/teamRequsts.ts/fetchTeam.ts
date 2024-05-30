import axios, { AxiosError } from 'axios';
import Team from '../../types/Team';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchTeam = async (name: string) => {
  const team = await axios
    .get<Team | string>(`${baseUrl}/team/${name}`, { withCredentials: true })
    .then((res) => {
      if (res.status === 404) {
        console.log(res.data);
        return res.data as string;
      } else {
        return res.data as Team;
      }
    })
    .catch((error: AxiosError) => {
      return error.response?.data as string;
    });
  return team;
};
