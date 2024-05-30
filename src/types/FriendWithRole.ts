import Cs2Role from './Cs2Role';
import { TeamRequest } from './TeamRequest';

export interface FriendWithRole {
  id: number;
  nickname: string;
  user_avatar: string;
  role?: Cs2Role;
  req?: TeamRequest;
  lvlImg?: string;
}
