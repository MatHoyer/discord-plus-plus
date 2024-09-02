'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { sendMessageSchema } from './send-message.schema';

export const sendMessage = authClient
  .schema(sendMessageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const session = await auth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    const message = await prisma.serverMessage.create({
      data: {
        content: parsedInput.message,
        channelId: parsedInput.channelId,
        senderId: ctx.userId,
      },
      include: {
        channel: true,
        sender: {
          include: {
            user: true,
          },
        },
      },
    });

    return message;
  });
