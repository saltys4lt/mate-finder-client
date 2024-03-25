import { io } from 'socket.io-client';

// export const socket = new WebSocket('ws://localhost:8080');
const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

export const ioSocket = io(webSocketUrl);

ioSocket.on('connection', () => {
  console.log('подключение установленно');
});
