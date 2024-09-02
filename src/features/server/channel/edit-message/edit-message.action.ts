'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { editMessageSchema } from './edit-message.schema';

export const editMessage = authClient
  .schema(editMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { content, messageId, channelId, serverId } = parsedInput;
    const { userId } = ctx;
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

    let message = await prisma.serverMessage.findUnique({
      where: {
        id: parsedInput.messageId,
        channelId,
      },
      include: {
        sender: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      throw new Error('Message not found');
    }

    const isOwner = message.senderId === member.id;

    if (!isOwner) {
      throw new Error('Unauthorized');
    }

    message = await prisma.serverMessage.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
      include: {
        sender: {
          include: {
            user: true,
          },
        },
      },
    });

    return message;
  });
