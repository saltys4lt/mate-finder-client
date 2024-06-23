import axios, { AxiosError } from 'axios';
import Option from '../types/Option';
import MapsImages from '../consts/MapsImages';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchMaps = async (setMaps: (maps: Option[]) => void) => {
  const team = await axios
    .get<Option[]>(`${baseUrl}/maps`, { withCredentials: true })
    .then((res) => {
      if (res.status === 404) {
        console.log(res.data);
        return;
      } else {
        setMaps(res.data.map((map) => ({ ...map, image: MapsImages[map.value] })));
        return;
      }
    })
    .catch((error: AxiosError) => {
      return error.response?.data as string;
    });
  return team;
};
