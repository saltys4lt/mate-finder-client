import { ioSocket } from '../webSockets/socket';

export const friendRequestAnswer = (request: { accept: boolean; requestId: number }) => {
  ioSocket.emit('friendRequestAction', request);
};
