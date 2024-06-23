import axios, { AxiosError } from 'axios';
import Team from '../../types/Team';
import { TeamsCs2Filters } from '../../types/queryTypes/TeamsCs2Filters';
const baseUrl = import.meta.env.VITE_BASE_URL;

interface FetchedData {
  teams: Team[];
  pages: number;
}

export const fetchTeams = async (
  data: TeamsCs2Filters,
  setPagesCount: (count: number) => void,
  setTeams: (teams: Team[]) => void,
  userId: number,
) => {
  const teamsWithCount = await axios
    .get<FetchedData>(`${baseUrl}/teams`, { withCredentials: true, params: { ...data, userId } })
    .then((res) => {
      if (res) {
        setPagesCount(res.data.pages);
        setTeams(res.data.teams);
      }
    })
    .catch((error: AxiosError) => {
      return error.response?.data as string;
    });
  return teamsWithCount;
};
