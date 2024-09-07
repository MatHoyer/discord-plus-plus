'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import fs from 'fs';
import { flattenValidationErrors } from 'next-safe-action';
import path from 'path';
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
    const {
      memberId,
      content,
      channelId,
      replyingToMessageId,
      attachmentFormData,
    } = parsedInput;

    const storedAttachments: {
      filename: string;
      contentType: string;
      size: number;
      url: string;
    }[] = [];

    if (attachmentFormData) {
      const attachments = attachmentFormData.getAll('attachments') as File[];
      for (const attachment of attachments) {
        const buffer = Buffer.from(await attachment.arrayBuffer());
        const fileName = `upload-${Date.now()}-${attachment.name}`;
        const filePath = path.join('uploads', fileName);
        const fullFilePath = path.join(process.cwd(), 'public', filePath);

        fs.writeFileSync(fullFilePath, buffer);

        storedAttachments.push({
          filename: fileName,
          contentType: attachment.type,
          size: attachment.size,
          url: '/' + filePath.replaceAll('\\', '/'),
        });
      }
    }

    const message = await prisma.serverMessage.create({
      data: {
        content,
        channelId,
        senderId: memberId,
        referencedMessageId: replyingToMessageId,
        attachments: {
          create: storedAttachments,
        },
      },
    });

    return await formatMessageMention(message, true);
  });
