'use client';

import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import Message from '../Message';

const ScrollableChat: React.FC<{ channel: ChannelWithMessages }> = ({
  channel,
}) => {
  const [messages, setMessages] = useState<ServerMessageWithSender[]>(
    channel.messages
  );

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
    </div>
  );
};

export default ScrollableChat;
