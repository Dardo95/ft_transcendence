import * as React from 'react';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Message, MessageContent } from '@/components/ui/message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { useChatStore } from '../store/useChatStore';
import { useLanguage } from '@/locales/useLanguage';
import { cn } from '@/lib/utils';

import { useLobbyStore } from '../store/useLobbyStore';

export function LobbyChat() {
  const { user } = useAuthStore();
  const { isConnected } = useSocketStore();
  const { messages, sendMessage, initChatListeners } = useChatStore();
  const [inputValue, setInputValue] = React.useState('');
  const { t } = useLanguage();

  const lobbyId = useLobbyStore((state) => state.lobby?.id);
  const clearMessages = useChatStore((state) => state.clearMessages);

  React.useEffect(() => {
    if (!lobbyId) return;
    clearMessages();
    const cleanup = initChatListeners();
    return () => {
      cleanup();
      clearMessages();
    };
  }, [lobbyId, initChatListeners, clearMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputValue.trim();
    if (!lobbyId || !isConnected || !cleanText || cleanText.length > 500) {
      return;
    }
    sendMessage(cleanText);
    setInputValue('');
  };

  return (
    <Card className="flex h-104 flex-col rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 shadow-xl">
      {/* Chat header */}
      <div className="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-300 uppercase">
          <span>💬</span>
          <span>{t('app.lobby.lobbyChat') || 'Lobby Chat'}</span>
        </h4>
        <span
          className={`h-2 w-2 rounded-full ${
            isConnected
              ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
              : 'bg-red-500'
          }`}
          title={
            isConnected
              ? t('app.general.connected') || 'Conectado'
              : t('app.general.connecting') || 'Desconectado'
          }
        />
      </div>

      {/* Visor scroller de shadcn */}
      <div className="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="flex flex-col gap-3 p-1">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user?.id;
                  const isSystem = msg.sender === 'Sistema';
                  const isLast = index === messages.length - 1;

                  return (
                    <MessageScrollerItem
                      key={msg.id}
                      messageId={msg.id}
                      scrollAnchor={isLast}
                    >
                      <Message align={isMe ? 'end' : 'start'}>
                        <MessageContent
                          className={isMe ? 'items-end' : 'items-start'}
                        >
                          {/* User info and time aligned to the right if it's mine */}
                          <span
                            className={cn(
                              'mb-1 flex items-center gap-1.5 text-[10px] text-zinc-400',
                              isMe
                                ? 'justify-end text-right'
                                : 'justify-start text-left'
                            )}
                          >
                            <span
                              className={cn(
                                'font-semibold',
                                isMe ? 'text-orange-400' : 'text-zinc-300'
                              )}
                            >
                              {msg.sender}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>

                          <Bubble
                            align={isMe ? 'end' : 'start'}
                            variant={
                              isSystem
                                ? 'system'
                                : isMe
                                  ? 'primary'
                                  : 'secondary'
                            }
                          >
                            <BubbleContent>{msg.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })}{' '}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {/* Input de envío */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            t('app.lobby.sendMessagePlaceholder') ||
            'Enviar mensaje a tu lobby...'
          }
          disabled={!lobbyId || !isConnected}
          maxLength={500}
          className="h-8 border-zinc-700 bg-zinc-950 text-xs text-zinc-200 placeholder:text-zinc-500"
        />
        <Button
          type="submit"
          size="sm"
          disabled={
            !lobbyId ||
            !isConnected ||
            !inputValue.trim() ||
            inputValue.trim().length > 500
          }
          className="h-8 bg-orange-600 px-3 text-white hover:bg-orange-500"
        >
          <SendIcon className="size-3.5" />
          <span className="sr-only">
            {t('app.lobby.sendButton') || 'Enviar'}
          </span>
        </Button>
      </form>
    </Card>
  );
}
