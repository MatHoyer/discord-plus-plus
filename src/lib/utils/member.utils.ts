import { ProfileRole } from '@prisma/client';

export const checkRole = (role: ProfileRole) => {
  const isAdmin = role === ProfileRole.ADMIN;
  const isModerator = isAdmin || role === ProfileRole.MODERATOR;

  return { isAdmin, isModerator };
};
