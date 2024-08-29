'use client';

import { getCustomDate } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import Message from '../Message';
import { ScrollArea } from '../ui/scroll-area';

const ScrollableChat: React.FC<{ channel: ChannelWithMessages }> = ({
  channel,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [channel.messages]);

  return (
    <ScrollArea className="h-[85%] flex flex-col-reverse justify-end mr-5">
      {channel.messages.map((message) => (
        <Message
          key={message.id}
          username={message.sender?.user.name || 'Deleted User'}
          message={message.content}
          time={getCustomDate(message.createdAt)}
        />
      ))}
      <div ref={bottomRef} />
    </ScrollArea>
  );
};

export default ScrollableChat;
