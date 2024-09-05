'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { formatMessageMention } from '../format-message-mention';
import { sendMessageSchema } from './send-message.schema';

export const sendMessage = authClient
  .schema(sendMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const { memberId, content, channelId, replyingToMessageId } = parsedInput;

    const message = await prisma.serverMessage.create({
      data: {
        content,
        channelId,
        senderId: memberId,
        referencedMessageId: replyingToMessageId,
      },
    });

    return await formatMessageMention(message, true);
  });
