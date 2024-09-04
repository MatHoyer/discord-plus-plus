import { Member, ServerMessage } from '@prisma/client';
import { checkRole } from './member.utils';

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

export const parseMentionsMessage = (message: string) =>
  message.replace(
    /<span[^>]*data-user-id="(\w+)"[^>]*>@[^<]+<\/span>/g,
    '<@$1>'
  );
