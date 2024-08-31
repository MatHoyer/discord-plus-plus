'use client';

import { getCustomDate } from '@/lib/utils';
import Message from '../Message';

const ScrollableChat: React.FC<{ channel: ChannelWithMessages }> = ({
  channel,
}) => {
  return (
    <div className="h-[85%] flex flex-col-reverse mr-5 overflow-y-scroll">
      {channel.messages.map((message) => (
        <Message
          key={message.id}
          username={message.sender?.user.name || 'Deleted User'}
          message={message.content}
          time={getCustomDate(message.createdAt)}
        />
      ))}
    </div>
  );
};

export default ScrollableChat;
