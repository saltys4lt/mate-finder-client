import Team from '../../types/Team';
import { ioSocket } from '../webSockets/socket';

interface params {
  team: Team;
  userId: number;
  byOwner: boolean;
}

export const leaveFromTeam = (data: params) => {
  ioSocket.emit('leaveTeam', data);
};
