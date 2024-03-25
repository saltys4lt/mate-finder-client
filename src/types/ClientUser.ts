import Cs2Data from './Cs2Data';
import Team from './Team';
import ValorantData from './ValorantData';

export default interface ClientUser {
  id: number;
  nickname: string;
  age: number;
  user_avatar?: string;
  description?: string;
  gender: string;
  birthday: string;
  valorant_data?: ValorantData | null;
  cs2_data?: Cs2Data | null;
  teams?: Team[];
}
