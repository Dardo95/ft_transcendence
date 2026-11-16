import { create } from 'zustand';
import { chatSocket } from '@/lib/socket';

export type ChatSystemEvent = 'user_joined' | 'user_left';

export interface ChatMessage {
  id: string;
  senderId?: number;
  sender: string;
  avatarUrl?: string | null;
  text: string;
  timestamp: string;
  systemEvent?: ChatSystemEvent;
  targetUsername?: string;
}

interface ChatSystemNotice {
  id: string;
  type: ChatSystemEvent;
  username: string;
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

    const handleSystemNotice = (notice: ChatSystemNotice) => {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: notice.id,
            sender: 'System',
            text: '',
            timestamp: notice.timestamp,
            systemEvent: notice.type,
            targetUsername: notice.username,
          },
        ],
      }));
    };

    chatSocket.on('chat:message', handleIncoming);
    chatSocket.on('chat:system', handleSystemNotice);

    return () => {
      chatSocket.off('chat:message', handleIncoming);
      chatSocket.off('chat:system', handleSystemNotice);
    };
  },
}));
