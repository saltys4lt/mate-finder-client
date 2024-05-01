import Cs2Data from './Cs2Data';
import { Membership } from './Membership';
import Team from './Team';
import { TeamRequest } from './TeamRequest';
import ValorantData from './ValorantData';
import { FriendRequest } from './friendRequest';

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
  teams: Team[];
  friends: ClientUser[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  requestsToTeam: TeamRequest[];
  memberOf: Membership[];
}
