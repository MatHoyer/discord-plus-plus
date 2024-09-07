import { Channel } from '@prisma/client';
import React from 'react';
import MessageReaction from './MessageReaction';

type TMessageReactionsProps = {
  reactions: ServerMessageReactionWithMembers[];
  currentMember: MemberWithUser;
  channel?: Channel;
};

const MessageReactions: React.FC<TMessageReactionsProps> = ({
  reactions,
  currentMember,
  channel,
}) => {
  if (reactions.length === 0) return null;
  console.log('coucou');

  return (
    <div className="flex gap-2 group mt-[4.5px]">
      {reactions.map((reaction) => (
        <MessageReaction
          key={reaction.id}
          reaction={reaction}
          currentMember={currentMember}
          channel={channel}
        />
      ))}
    </div>
  );
};

export default MessageReactions;
