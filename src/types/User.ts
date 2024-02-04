import Cs2Data from './Cs2Data';
import Team from './Team';
import ValorantData from './ValorantData';

export default interface User {
  nickname: string;
  email: string;
  password: string;
  user_avatar?: string;
  description?: string;
  gender: string;
  birthday: string;
  valorant_data?: ValorantData;
  cs2_data?: Cs2Data;
  teams?: Team[];
  steamId?: string;
}
