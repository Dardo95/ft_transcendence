import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquareIcon, SendIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import defaultAvatar from '@/assets/default.jpg';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useSocketStore } from '@/stores/useSocketStore';
import { useChatStore } from '../store/useChatStore';
import { useLanguage } from '@/locales/useLanguage';

import { cn } from '@/lib/utils';

export function GlobalChat() {
  const { user } = useAuthStore();
  const { isConnected } = useSocketStore();
  const { messages, sendMessage } = useChatStore();
  const [inputValue, setInputValue] = React.useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanText = inputValue.trim();

    if (!isConnected || !cleanText || cleanText.length > 500) {
      return;
    }

    sendMessage(cleanText);
    setInputValue('');
  };

  return (
    <Card className="flex h-104 flex-col p-4">
      {/* Chat header */}
      <div className="border-border mb-2 flex items-center justify-between border-b pb-2">
        <h4 className={UI.text.sublabelRow}>
          <MessageSquareIcon className={UI.icon.xs} aria-hidden="true" />
          <span>{t('app.lobby.globalChat') || 'Global Chat'}</span>
        </h4>

        <span
          className={`${UI.feedback.dot} ${
            isConnected
              ? 'bg-success shadow-success/50 shadow-sm'
              : 'bg-destructive'
          }`}
          title={
            isConnected
              ? t('app.general.connected') || 'Conectado'
              : t('app.general.connecting') || 'Desconectado'
          }
        />
      </div>

      {/* Message scroller */}
      <div className="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="flex flex-col gap-2 p-1">
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  const isSystem = msg.sender === 'System';
                  const profileLink = `/profile/${encodeURIComponent(
                    msg.sender
                  )}`;
                  const hasSender = Boolean(msg.sender);
                  const systemPhrase =
                    msg.systemEvent === 'user_joined'
                      ? t('app.lobby.userConnected') || 'has connected'
                      : msg.systemEvent === 'user_left'
                        ? t('app.lobby.userDisconnected') || 'has disconnected'
                        : null;

                  return (
                    <MessageScrollerItem key={msg.id} messageId={msg.id}>
                      <div className="w-full min-w-0">
                        {/* User info and time span the whole row, including the avatar */}
                        <div
                          className={cn(
                            'text-muted-foreground mb-1 flex items-center gap-1.5 text-[10px]',
                            isSystem
                              ? 'justify-center text-center'
                              : isMe
                                ? 'justify-end text-right'
                                : 'justify-start text-left'
                          )}
                        >
                          {isSystem ? (
                            <span className="text-secondary-foreground font-semibold">
                              {t('app.lobby.systemLabel') || 'System'}
                            </span>
                          ) : hasSender ? (
                            <Link
                              to={profileLink}
                              title={t('profile.publicProfile')}
                              className={cn(
                                UI.link.chatName,
                                isMe
                                  ? 'text-primary'
                                  : 'text-secondary-foreground'
                              )}
                            >
                              {msg.sender}
                            </Link>
                          ) : null}

                          <span>•</span>

                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <Message align={isMe ? 'end' : 'start'}>
                          {!isSystem && hasSender && (
                            <MessageAvatar className="size-8">
                              <Link
                                to={profileLink}
                                title={t('profile.publicProfile')}
                                className={UI.link.chatAvatar}
                              >
                                <img
                                  src={msg.avatarUrl || defaultAvatar}
                                  alt={msg.sender}
                                  className={UI.avatar.chat}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      defaultAvatar;
                                  }}
                                />
                              </Link>
                            </MessageAvatar>
                          )}

                          <MessageContent
                            className={
                              isSystem
                                ? 'items-center'
                                : isMe
                                  ? 'items-end'
                                  : 'items-start'
                            }
                          >
                            <Bubble
                              align={
                                isSystem ? 'center' : isMe ? 'end' : 'start'
                              }
                              variant={
                                isSystem
                                  ? 'system'
                                  : isMe
                                    ? 'primary'
                                    : 'secondary'
                              }
                            >
                              <BubbleContent>
                                {isSystem &&
                                msg.targetUsername &&
                                systemPhrase ? (
                                  <>
                                    <Link
                                      to={`/profile/${encodeURIComponent(
                                        msg.targetUsername
                                      )}`}
                                      title={t('profile.publicProfile')}
                                      className={UI.link.inline}
                                    >
                                      {msg.targetUsername}
                                    </Link>{' '}
                                    {systemPhrase}
                                  </>
                                ) : (
                                  msg.text
                                )}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </div>
                    </MessageScrollerItem>
                  );
                })}
              </MessageScrollerContent>
            </MessageScrollerViewport>

            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className={`mt-3 ${UI.row.actions}`}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            t('app.lobby.sendMessagePlaceholder') ||
            'Enviar mensaje a todos los jugadores...'
          }
          disabled={!isConnected}
          maxLength={500}
          className="h-8 text-xs"
        />

        <Button
          type="submit"
          size="sm"
          disabled={
            !isConnected || !inputValue.trim() || inputValue.trim().length > 500
          }
          className="h-8 px-3"
        >
          <SendIcon className={UI.icon.xs} />

          <span className="sr-only">
            {t('app.lobby.sendButton') || 'Enviar'}
          </span>
        </Button>
      </form>
    </Card>
  );
}
