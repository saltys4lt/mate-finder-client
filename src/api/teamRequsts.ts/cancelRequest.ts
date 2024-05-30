import { TeamRequest } from '../../types/TeamRequest';
import { ioSocket } from '../webSockets/socket';

export const cancelRequest = (req: TeamRequest) => {
  ioSocket.emit('cancelTeamRequest', req);
};
