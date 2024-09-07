'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { ProfileRole } from '@prisma/client';
import { flattenValidationErrors } from 'next-safe-action';
import { deleteChannelSchema } from './delete-channel.schema';

export const deleteChannel = authClient
  .schema(deleteChannelSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { channelId, guildId } = parsedInput;
    const { userId } = ctx;

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        guild: {
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

    await prisma.guild.update({
      where: {
        id: guildId,
        members: {
          some: {
            userId,
            role: {
              in: [ProfileRole.ADMIN, ProfileRole.MODERATOR],
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
        guildId,
      },
    });

    return { channel, generalChannel };
  });
