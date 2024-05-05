import { Chat } from './Chat';
import ClientUser from './ClientUser';
import Cs2Role from './Cs2Role';
import { Membership } from './Membership';
import { TeamRequest } from './TeamRequest';

export default interface Team {
  id?: number;
  game: 'cs2' | 'valorant';
  user: ClientUser;
  userId: number;
  ownerRole: string;
  name: string;
  avatar: string;
  description: string;
  public: boolean;
  neededRoles: Cs2Role[];
  teamRequests: TeamRequest[];
  members: Membership[];
  chat: Chat;
}
