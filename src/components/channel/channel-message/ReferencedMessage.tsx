import ProfileContextMenu from '@/components/context-menus/ProfileContextMenu';
import ProfilePopover from '@/components/profile/ProfilePopover';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { mentionToSpan } from '@/lib/utils/message.utils';
import React, { useMemo } from 'react';

type TReferencedMessageProps = {
  message: ServerMessageWithSender;
  preview: boolean;
  onReferencedMessageClicked?: (message: ServerMessageWithSender) => void;
};

const ReferencedMessage: React.FC<TReferencedMessageProps> = ({
  message,
  preview,
  onReferencedMessageClicked,
}) => {
  const parsedReferencedMessage = useMemo(
    () =>
      message.referencedMessage
        ? mentionToSpan(message.referencedMessage, preview)
        : [],
    [message.referencedMessage, preview]
  );

  return (
    message.referencedMessage && (
      <div className="before:content-[''] before:absolute before:border-zinc-500 before:left-[28px] before:top-[10px] before:w-[22px] md:before:left-[35px] md:before:top-[9px] md:before:w-[25px] before:h-[11px] before:rounded-tl-md before:border-0 before:border-t-2 before:border-l-2 ml-[53px] md:ml-16 mb-[1.5px] text-xs text-zinc-400 flex gap-1 items-center">
        <ProfileContextMenu
          member={message.referencedMessage.sender}
          disabled={preview}
        >
          <ProfilePopover
            member={message.referencedMessage.sender}
            asChild={false}
            disabled={preview}
            triggerProps={{
              className: 'flex gap-1',
            }}
          >
            <UserAvatar
              src={message.referencedMessage.sender.user.image}
              size="xxs"
              className="mt-[6px] md:mt-[1.5px]"
            />
            <p
              className={cn(
                'font-bold text-sm',
                !preview && 'hover:underline cursor-pointer'
              )}
            >
              {message.referencedMessage.sender.username}
            </p>
          </ProfilePopover>
        </ProfileContextMenu>
        <div
          className="hover:text-zinc-200 transition-colors cursor-pointer"
          onClick={() => {
            onReferencedMessageClicked?.(message.referencedMessage);
          }}
        >
          {parsedReferencedMessage}
        </div>
      </div>
    )
  );
};

export default ReferencedMessage;
