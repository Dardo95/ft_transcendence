import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_WS_URL || window.location.origin;

const options = {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket', 'polling'] as (
    | 'websocket'
    | 'polling'
  )[],
};

export const chatSocket = io(`${SOCKET_URL}/chat`, options);

export const gameSocket = io(`${SOCKET_URL}/game`, options);