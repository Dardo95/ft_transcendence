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
      if (get().sessionReplaced) {
        return;
      }

      if (!chatSocket.connected) {
        chatSocket.connect();
      }

      // El gateway /game vive en un socket aparte: sin esto
      // nadie lo conecta nunca (autoConnect: false).
      if (!gameSocket.connected) {
        gameSocket.connect();
      }
    },

    disconnect: () => {
      if (chatSocket.connected) {
        chatSocket.disconnect();
      }

      if (gameSocket.connected) {
        gameSocket.disconnect();
      }
    },
  };
});
