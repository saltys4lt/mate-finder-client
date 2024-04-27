import { TeamRequest } from '../../types/TeamRequest';
import { ioSocket } from '../webSockets/socket';

export const answerTeamRequest = (req: { accept: boolean; req: TeamRequest }) => {
  ioSocket.emit('answerTeamRequest', req);
};
