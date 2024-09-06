import ProfileContextMenu from '@/components/context-menus/ProfileContextMenu';
import ProfilePopover from '@/components/profile/ProfilePopover';
import { Member, ServerMessage } from '@prisma/client';
import { cn } from '.';
import { checkRole } from './member.utils';

export const MESSAGE_TOP_LIMIT = 50;

export const checkMessage = (
  member: Member,
  currentMember: Member,
  message: ServerMessage
) => {
  const { isAdmin, isModerator } = checkRole(currentMember.role);
  const isOwner = currentMember.id === member.id;

  return {
    canDeleteMessage: !message.deleted && (isAdmin || isModerator || isOwner),
    canEditMessage: !message.deleted && isOwner,
    isOwner,
    isAdmin,
    isModerator,
  };
};

export const spanToMention = (message: string) =>
  message.replace(
    /<span[^>]*data-user-id="(\w+)"[^>]*>@[^<]+<\/span>/g,
    '<@$1>'
  );

export const mentionClassName =
  'text-white px-2 py-1 bg-[#3c4270] bg-opacity-50 font-semibold rounded-sm inline-block';

export const mentionToSpan = (
  message: ServerMessageWithSender,
  disabled: boolean = false
) => {
  const parts = message.content.split(/(<@\w+>)/g);
  return parts.map((part, index) => {
    const match = part.match(/^<@(\w+)>$/);
    if (match) {
      const mentionId = +match[1];
      const mention = message.mentions?.find((m) => m.id === mentionId);
      if (mention) {
        return (
          <ProfileContextMenu
            key={index}
            member={mention.member}
            disabled={disabled}
          >
            <ProfilePopover member={mention.member} asChild disabled={disabled}>
              <span
                role="button"
                aria-expanded="false"
                className={cn(
                  mentionClassName,
                  !disabled &&
                    'hover:bg-[#5864f3] hover:bg-opacity-100 transition-colors hover:underline cursor-pointer'
                )}
              >
                @{mention.member.username}
              </span>
            </ProfilePopover>
          </ProfileContextMenu>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
};
