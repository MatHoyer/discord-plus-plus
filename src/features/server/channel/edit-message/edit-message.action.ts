'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { checkMessage } from '../check-message';
import { editMessageSchema } from './edit-message.schema';

export const editMessage = authClient
  .schema(editMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { content, messageId, channelId, serverId } = parsedInput;
    let message = await checkMessage({
      channelId,
      serverId,
      messageId,
      userId: ctx.userId,
    });

    message = await prisma.serverMessage.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
      include: {
        mentions: {
          include: {
            member: true,
          },
        },
        sender: {
          include: {
            user: true,
          },
        },
      },
    });

    return message;
  });
