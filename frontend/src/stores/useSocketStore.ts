import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';

interface SocketState {
  isConnected: boolean;
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
