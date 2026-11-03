import { create } from 'zustand';
import { chatSocket, gameSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

interface SocketState {
  isConnected: boolean;
  sessionReplaced: boolean;
  socket: Socket;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => {
  chatSocket.on('connect', () => {
    set({ isConnected: true });
  });

  chatSocket.on('disconnect', () => {
    set({ isConnected: false });
  });

  chatSocket.on('connect_error', () => {
    set({ isConnected: false });
  });

  chatSocket.on('session:replaced', () => {
    set({ sessionReplaced: true, isConnected: false });
  });

  gameSocket.on('session:replaced', () => {
    set({ sessionReplaced: true });
  });

  return {
    isConnected: chatSocket.connected,
    sessionReplaced: false,
    socket: chatSocket,

    connect: () => {
      if (!chatSocket.connected && !get().sessionReplaced) {
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
