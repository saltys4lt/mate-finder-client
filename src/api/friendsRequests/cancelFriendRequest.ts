import { ioSocket } from '../webSockets/socket';

export const cancelFriendRequest = (reqId: number) => {
  ioSocket.emit('cancelFriendRequest', reqId);
};
