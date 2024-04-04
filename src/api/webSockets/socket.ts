import { io } from 'socket.io-client';

export const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

export const ioSocket = io(webSocketUrl, { withCredentials: true });
