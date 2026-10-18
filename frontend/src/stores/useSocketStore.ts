import { create } from 'zustand';
import { socket } from '@/lib/socket';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface SocketState {
  isConnected: boolean;
  messages: ChatMessage[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (sender: string, text: string) => void;
  addMessage: (msg: ChatMessage) => void;
}

export const useSocketStore = create<SocketState>((set, get) => {
  // Configuración de listeners globales de socket.io
  socket.on('connect', () => {
    set({ isConnected: true });
  });

  socket.on('disconnect', () => {
    set({ isConnected: false });
  });

  socket.on('chat:message', (incomingMsg: ChatMessage) => {
    get().addMessage(incomingMsg);
  });

  return {
    isConnected: socket.connected,
    messages: [
      {
        id: 'welcome-1',
        sender: 'Sistema',
        text: '¡Bienvenido a la cocina! Canal general listo.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ],

    connect: () => {
      if (!socket.connected) {
        socket.connect();
      }
    },

    disconnect: () => {
      if (socket.connected) {
        socket.disconnect();
      }
    },

    addMessage: (msg: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    },

    sendMessage: (sender: string, text: string) => {
      const payload: ChatMessage = {
        id: crypto.randomUUID(),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Emitir al backend
      socket.emit('chat:send', payload);

      // Añadir de forma optimista al store local
      get().addMessage(payload);
    },
  };
});
