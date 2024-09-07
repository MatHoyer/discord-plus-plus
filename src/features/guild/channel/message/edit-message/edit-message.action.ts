'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { checkMessage } from '../check-message';
import { formatMessageMention } from '../format-message-mention';
import { editMessageSchema } from './edit-message.schema';

export const editMessage = authClient
  .schema(editMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { content, messageId, channelId, guildId } = parsedInput;

    await checkMessage({
      channelId,
      guildId,
      messageId,
      userId: ctx.userId,
      edit: true,
    });

    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    return await formatMessageMention(message, false);
  });
