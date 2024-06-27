import Cs2Role from '../types/Cs2Role';
import Team from '../types/Team';

export const isDisabledRole = (role: Cs2Role, ownerRole: string, isTeam: boolean, team: Team, isReqsToTeamExist?: boolean) => {
  if (isReqsToTeamExist) return true;
  if (ownerRole === role.name) return true;

  if (isTeam) {
    if (team.members.find((member) => member.roleId === role.id)) return true;
  }

  return false;
};
