import ClientUser from './ClientUser';
import Cs2Role from './Cs2Role';
import Team from './Team';

export interface Membership {
  id?: number;
  role: Cs2Role;
  team: Team;
  teamId: number;
  roleId: number;
  user: ClientUser;
}
