import { TeamRequest } from '../../types/TeamRequest';
import { ioSocket } from '../webSockets/socket';

export const sendTeamRequestsToFriends = (teamReqs: TeamRequest[]) => {
  ioSocket.emit('teamRequestToFriends', teamReqs);
};
