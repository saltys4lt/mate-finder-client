import Cs2Role from '../types/Cs2Role';
import { FriendWithRole } from '../types/FriendWithRole';
import Team from '../types/Team';

export const isDisabledRole = (role: Cs2Role, ownerRole: string, invitedFriends: FriendWithRole[], isTeam: boolean, team: Team) => {
  if (ownerRole === role.name) return true;
  if (invitedFriends.find((friend) => friend.role === role.name)) return true;

  if (isTeam) {
    if (team.members.find((member) => member.roleId === role.id)) return true;
    if (team.teamRequests.find((tr) => tr.roleId === role.id)) return true;
  }

  return false;
};
