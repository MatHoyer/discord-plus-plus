'use server';

import prisma from '@/lib/prisma';
import { checkRole } from '@/lib/utils/member.utils';
import { MESSAGE_INCLUDES } from '@/lib/utils/message.utils';

export const checkMessage = async ({
  userId,
  channelId,
  guildId,
  messageId,
  edit,
}: {
  userId: number;
  guildId: number;
  channelId: number;
  messageId: number;
  edit: boolean;
}) => {
  const server = await prisma.guild.findFirst({
    where: {
      id: guildId,
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!server) {
    throw new Error('Server not found');
  }

  const channel = await prisma.channel.findFirst({
    where: {
      id: channelId,
      guildId,
    },
  });

  if (!channel) {
    throw new Error('Channel not found');
  }

  const member = server.members.find((m) => m.userId === userId);

  if (!member) {
    throw new Error('Member not found');
  }

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      channelId,
    },
    ...MESSAGE_INCLUDES,
  });

  if (!message || message.deleted) {
    throw new Error('Message not found');
  }

  const isOwner = message.authorId === member.id;

  if (!isOwner && edit) {
    throw new Error('Unauthorized');
  }
  const { isAdmin, isModerator } = checkRole(member.role);
  const canDelete = isAdmin || isModerator || isOwner;

  if (!edit && !canDelete) {
    throw new Error('Unauthorized');
  }

  return message;
};
