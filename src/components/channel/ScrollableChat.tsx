'use client';

import { loadMoreMessages } from '@/features/server/channel/loadMoreMessages';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { Member, User } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import ChannelMessage from './ChannelMessage';

const ScrollableChat: React.FC<{
  channel: ChannelWithMessages;
  currentMember: Member & { user: User };
}> = ({ channel, currentMember }) => {
  const [messages, setMessages] = useState<ServerMessageWithSender[]>(
    channel.messages
  );

  const topRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    const key = `channel:${channel.id}`;
    socket.on(`${key}:new-message`, (message: ServerMessageWithSender) => {
      setMessages((prev) => [message, ...prev]);
    });

    socket.on(`${key}:edit-message`, (message: ServerMessageWithSender) => {
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === message.id);
        if (index === -1) {
          return prev;
        }
        const newMessages = [...prev];
        newMessages[index] = message;
        return newMessages;
      });
    });

    socket.on(`${key}:delete-message`, (messageId: number) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      socket.off(`${key}:new-message`);
      socket.off(`${key}:edit-message`);
      socket.off(`${key}:delete-message`);
    };
  }, [channel.id]);

  useEffect(() => {
    const ref = topRef.current;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && messages.length !== countRef.current) {
          const { messages: newMessages, messagesCount } =
            await loadMoreMessages(channel.id, messages.length);
          countRef.current = messagesCount;
          setMessages((prev) => [...prev, ...newMessages]);
        }
      },
      { threshold: 0.01 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [channel.id, messages]);

  return (
    <div className="flex-1 overflow-y-scroll flex flex-col-reverse">
      {messages.map((message) => (
        <ChannelMessage
          key={message.id}
          message={message}
          currentMember={currentMember}
          time={getCustomDate(new Date(message.createdAt))}
        />
      ))}
      <div ref={topRef} className="p-1" />
    </div>
  );
};

export default ScrollableChat;
