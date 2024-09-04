import { reactToMessage } from '@/features/server/channel/message/react-to-message/react-to-message.action';
import { cn } from '@/lib/utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import React from 'react';
import { ServerSocketEvents } from '../../../server/socket/server';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type TMessageReactionProps = {
  reaction: ServerMessageReactionWithMembers;
  currentMember: MemberWithUser;
  channel?: Channel;
};

const MessageReaction: React.FC<TMessageReactionProps> = ({
  reaction,
  currentMember,
  channel,
}) => {
  const { execute } = useAction(reactToMessage, {
    onSuccess: ({ data }) => {
      if (typeof data === 'number') {
        socket.emit(ServerSocketEvents.deleteReaction, {
          reactionId: reaction.id,
          channelId: channel!.id,
        });
      } else {
        socket.emit(ServerSocketEvents.reactedToMessage, {
          reaction: data,
          channelId: channel!.id,
        });
      }
    },
  });

  const hasReacted = reaction.members.some(
    (member) => member.memberId === currentMember.id
  );

  const preview = !channel;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild className="cursor-auto">
          <button
            onClick={
              preview
                ? undefined
                : async () => {
                    await execute({
                      content: reaction.content,
                      memberId: currentMember.id,
                      messageId: reaction.messageId,
                    });
                  }
            }
            className={cn(
              'group/reaction bg-[#2b2d31]/50 px-1 flex items-center rounded-lg select-none border-[#2b2d31]/0 transition-colors gap-[2px]',
              hasReacted
                ? 'border-[#5865f2] border'
                : 'hover:border-[#505256] border',
              !preview && 'cursor-pointer'
            )}
          >
            <span className="flex items-center justify-center">
              {reaction.content}
            </span>
            <span
              className={cn(
                'group-hover/reaction:text-white text-zinc-500 transition-colors text-sm',
                hasReacted && 'text-white font-bold'
              )}
            >
              {reaction.number}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-[#111214]">
          <div className="flex items-center py-2 gap-1">
            <span className="text-3xl">{reaction.content}</span>
            <span className="text-xs text-zinc-200">
              reacted by{' '}
              {reaction.members.map((m) => m.member.username).join(', ')}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MessageReaction;
