'use client';

import { loadMoreMessages } from '@/features/server/channel/loadMoreMessages';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { useEffect, useRef, useState } from 'react';
import Message from '../Message';

const ScrollableChat: React.FC<{ channel: ChannelWithMessages }> = ({
  channel,
}) => {
  const [messages, setMessages] = useState<ServerMessageWithSender[]>(
    channel.messages
  );
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on(
      `channel:${channel.id}:new-message`,
      (message: ServerMessageWithSender) => {
        setMessages((prev) => [message, ...prev]);
      }
    );
    return () => {
      socket.off(`channel:${channel.id}:new-message`);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const newMessages = await loadMoreMessages(
            channel.id,
            messages.length
          );
          setMessages((prev) => [...prev, ...newMessages]);
        }
      },
      { threshold: 0.01 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      if (topRef.current) {
        observer.unobserve(topRef.current);
      }
    };
  }, [messages]);

  return (
    <div className="h-[85%] flex flex-col-reverse mr-5 overflow-y-scroll">
      {messages.map((message) => (
        <Message
          key={message.id}
          username={message.sender?.user.name || 'Deleted User'}
          message={message.content}
          time={getCustomDate(new Date(message.createdAt))}
        />
      ))}
      <div ref={topRef} className="p-1" />
    </div>
  );
};

export default ScrollableChat;
