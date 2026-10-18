import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'https://localhost:8443';

export const socket: Socket = io(WS_URL, {
  withCredentials: true,
  autoConnect: false, // The store will handle the connection when the user is authenticated
  transports: ['websocket', 'polling'],
});
