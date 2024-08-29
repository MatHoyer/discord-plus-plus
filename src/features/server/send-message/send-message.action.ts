'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { SendMessageSchema } from './send-message.schema';

export const sendMessage = authClient
  .schema(SendMessageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const message = await prisma.serverMessage.create({
      data: {
        content: parsedInput.message,
        channelId: parsedInput.channelId,
        senderId: ctx.userId,
      },
      include: {
        channel: true,
      },
    });

    revalidatePath(
      `/servers/${message.channel.serverId}/channels/${message.channelId}`
    );

    return message;
  });
