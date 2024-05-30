import { useMemo } from 'react';

import { TeamRequest } from '../types/TeamRequest';

export const useTeamRequests = (teamRequests: TeamRequest[] | null | undefined, id: number) => {
  const teamRequestsFromPlayers = useMemo(() => {
    return teamRequests ? teamRequests.filter((req) => !req.isFromTeam) : [];
  }, [teamRequests, id]);

  const teamRequestsFromTeam = useMemo(() => {
    return teamRequests ? teamRequests.filter((req) => req.isFromTeam) : [];
  }, [teamRequests, id]);

  return [teamRequestsFromPlayers, teamRequestsFromTeam];
};
