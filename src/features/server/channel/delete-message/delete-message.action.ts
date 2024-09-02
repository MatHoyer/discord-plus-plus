'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { checkMessage } from '../check-message';
import { deleteMessageSchema } from './delete-message.schema';

export const deleteMessage = authClient
  .schema(deleteMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { messageId, channelId, serverId } = parsedInput;

    let message = await checkMessage({
      channelId,
      serverId,
      messageId,
      userId: ctx.userId,
    });

    await prisma.serverMessage.delete({
      where: {
        id: messageId,
      },
    });

    return message;
  });
