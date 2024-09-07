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
    const { messageId, channelId, guildId } = parsedInput;

    const message = await checkMessage({
      channelId,
      guildId,
      messageId,
      userId: ctx.userId,
      edit: false,
    });

    await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        deleted: true,
      },
    });

    return message;
  });
