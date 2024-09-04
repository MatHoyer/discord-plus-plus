import { Member, ServerMessage } from '@prisma/client';
import { checkRole } from './member.utils';

export const checkMessage = (
  member: Member,
  currentMember: Member,
  message: ServerMessage
) => {
  const { isAdmin, isModerator } = checkRole(member.role);
  const isOwner = currentMember.id === member.id;
  return {
    canDeleteMessage: !message.deleted && (isAdmin || isModerator || isOwner),
    canEditMessage: !message.deleted && isOwner,
    isOwner,
    isAdmin,
    isModerator,
  };
};
