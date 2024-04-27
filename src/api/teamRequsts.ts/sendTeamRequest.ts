import { TeamRequest } from '../../types/TeamRequest';
import { ioSocket } from '../webSockets/socket';

export const sendTeamRequest = (req: TeamRequest) => {
  ioSocket.emit('teamRequestToUser', req);
};
