import ClientUser from './ClientUser';
import Cs2Role from './Cs2Role';
import Team from './Team';

export interface TeamRequest {
  id?: number;
  teamId?: number;
  team?: Team;
  toUserId: number;
  user?: ClientUser;
  roleId: number;
  role?: Cs2Role;
  isFromTeam: boolean;
}
