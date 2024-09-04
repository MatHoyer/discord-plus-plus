'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { MemberRole } from '@prisma/client';
import { flattenValidationErrors } from 'next-safe-action';
import { deleteChannelSchema } from './delete-channel.schema';

export const deleteChannel = authClient
  .schema(deleteChannelSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { channelId, serverId } = parsedInput;
    const { userId } = ctx;

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        server: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    const generalChannel = await prisma.channel.findFirst({
      where: {
        name: 'general',
        serverId: serverId,
      },
    });

    return { channel, generalChannel };
  });
