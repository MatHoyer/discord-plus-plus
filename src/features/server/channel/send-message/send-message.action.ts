'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
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
    const { memberId, ...rest } = parsedInput;
    const message = await prisma.serverMessage.create({
      data: {
        ...rest,
        senderId: memberId,
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
