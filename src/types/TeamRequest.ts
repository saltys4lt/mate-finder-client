import ClientUser from './ClientUser';
import Team from './Team';

export interface TeamRequest {
  id?: number;
  teamId: number;
  team: Team;
  ToUserId: number;
  user: ClientUser;
}
