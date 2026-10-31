import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';

export interface ChatMessage {
  id: string;
  senderId?: number;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  initChatListeners: () => () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  clearMessages: () => set({ messages: [] }),

  sendMessage: (text) => {
    const cleanText = text.trim();

    if (!cleanText || cleanText.length > 500 || !chatSocket.connected) {
      return;
    }

    chatSocket.emit('chat:send', {
      text: cleanText,
    });
  },

  initChatListeners: () => {
    const handleIncoming = (msg: ChatMessage) => {
      set((state) => ({
        messages: [...state.messages, msg],
      }));
    };

    chatSocket.on('chat:message', handleIncoming);

    return () => {
      chatSocket.off('chat:message', handleIncoming);
    };
  },
}));
