'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import fs from 'fs';
import { flattenValidationErrors } from 'next-safe-action';
import path from 'path';
import { checkMessage } from '../check-message';
import { deleteAttachmentSchema } from './delete-attachment.schema';

export const deleteAttachment = authClient
  .schema(deleteAttachmentSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const {
      messageId,
      channelId,
      guildId,
      attachmentId: atachmentId,
    } = parsedInput;

    const message = await checkMessage({
      channelId,
      guildId,
      messageId,
      userId: ctx.userId,
      edit: false,
    });

    const attachment = await prisma.attachment.findUnique({
      where: {
        id: atachmentId,
      },
    });

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    await prisma.attachment.delete({
      where: {
        id: attachment.id,
      },
    });

    fs.unlinkSync(path.join('public', attachment.url));
  });
