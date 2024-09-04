import { MemberRole } from '@prisma/client';

export const checkRole = (role: MemberRole) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return { isAdmin, isModerator };
};
