import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

interface SocketState {
  isConnected: boolean;
  socket: Socket;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => {
  chatSocket.on('connect', () => {
    set({ isConnected: true });
  });

  chatSocket.on('disconnect', () => {
    set({ isConnected: false });
  });

  chatSocket.on('connect_error', () => {
    set({ isConnected: false });
  });

  return {
    isConnected: chatSocket.connected,
    socket: chatSocket,

    connect: () => {
      if (!chatSocket.connected) {
        chatSocket.connect();
      }
    },

    disconnect: () => {
      if (chatSocket.connected) {
        chatSocket.disconnect();
      }
    },
  };
});
