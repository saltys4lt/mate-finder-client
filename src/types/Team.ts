import ClientUser from './ClientUser';
import Player from './Player';
import { TeamRequest } from './TeamRequest';

export default interface Team {
  game: 'cs2' | 'valorant';
  user: ClientUser;
  userId: number;
  ownerRole: string;
  name: string;
  avatar: string;
  description: string;
  public: boolean;
  neededRoles: string[];
  teamRequests: TeamRequest[];
  members: Player[];
}
