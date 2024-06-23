import Cs2Data from './Cs2Data';

export interface AdminPlayer {
  id?: number;
  password: string;
  nickname: string;
  email: string;
  user_avatar?: string;
  description?: string;
  gender: string;
  age?: number;
  birthday: string;
  cs2_data?: Cs2Data | null;
}
