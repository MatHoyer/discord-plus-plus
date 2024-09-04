'use server';
import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { MemberRole } from '@prisma/client';
import { flattenValidationErrors } from 'next-safe-action';
import { editChannelSchema } from './edit-channel.schema';

export const editChannel = authClient
  .schema(editChannelSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { channelId, name } = parsedInput;
    const { userId } = ctx;

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    await prisma.server.update({
      where: {
        id: channel.serverId,
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
            },
          },
        },
      },
    });

    return { ...channel, name };
  });
