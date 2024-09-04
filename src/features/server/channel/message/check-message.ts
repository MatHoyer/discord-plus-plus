'use server';

import prisma from '@/lib/prisma';
import { checkRole } from '@/lib/utils/member.utils';

export const checkMessage = async ({
  userId,
  channelId,
  serverId,
  messageId,
  edit,
}: {
  userId: number;
  serverId: number;
  channelId: number;
  messageId: number;
  edit: boolean;
}) => {
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
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
      serverId: serverId,
    },
  });

  if (!channel) {
    throw new Error('Channel not found');
  }

  const member = server.members.find((m) => m.userId === userId);

  if (!member) {
    throw new Error('Member not found');
  }

  const message = await prisma.serverMessage.findUnique({
    where: {
      id: messageId,
      channelId,
    },
    include: {
      sender: {
        include: {
          user: true,
        },
      },
      mentions: {
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!message || message.deleted) {
    throw new Error('Message not found');
  }

  const isOwner = message.senderId === member.id;

  if (!isOwner && edit) {
    throw new Error('Unauthorized');
  }
  const { isAdmin, isModerator } = checkRole(member.role);
  const canDelete = isAdmin || isModerator || isOwner;

  if (!edit && !canDelete) {
    throw new Error('Unauthorized');
  }

  return message as ServerMessageWithSender;
};
