import React from 'react';
import MessageReaction from './MessageReaction';

type TMessageReactionsProps = {
  reactions: ServerMessageReactionWithMembers[];
  currentMember: MemberWithUser;
};

const MessageReactions: React.FC<TMessageReactionsProps> = ({
  reactions,
  currentMember,
}) => {
  if (reactions.length === 0) return null;

  return (
    <div className="flex gap-2 group mt-[4.5px]">
      {reactions.map((reaction) => (
        <MessageReaction
          key={reaction.id}
          reaction={reaction}
          currentMember={currentMember}
        />
      ))}
    </div>
  );
};

export default MessageReactions;
