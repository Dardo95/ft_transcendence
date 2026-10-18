import { create } from 'zustand';
import { socket } from '@/lib/socket';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  sendMessage: (sender: string, text: string) => void;
  initChatListeners: () => () => void;
}

export const useChatStore = create<ChatState>((set) => ({
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

    // Emitir al Gateway de NestJS
    socket.emit('chat:send', payload);

    // Añadir localmente (actualización optimista)
    set((state) => ({ messages: [...state.messages, payload] }));
  },

  initChatListeners: () => {
    const handleIncoming = (msg: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    };

    socket.on('chat:message', handleIncoming);

    // Retorna función de limpieza para useEffect
    return () => {
      socket.off('chat:message', handleIncoming);
    };
  },
}));
