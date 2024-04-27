import { ioSocket } from '../webSockets/socket';

export const sendFriendRequest = (request: { fromUserId: number; toUserId: number }) => {
  console.log('232');
  ioSocket.emit('friendRequest', request);
};
