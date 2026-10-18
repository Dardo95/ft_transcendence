import { io } from 'socket.io-client';

// Empty or undefined target makes Socket.io connect to window.location.host
export const socket = io({
  path: '/socket.io',
  withCredentials: true,
  autoConnect: false, // The store will handle the connection when the user is authenticated
  transports: ['websocket', 'polling'],
});
