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
    const { memberId, content, channelId } = parsedInput;

    const message = await prisma.serverMessage.create({
      data: {
        content,
        channelId,
        senderId: memberId,
      },
    });

    const mentionPattern = /<@(\w+)>/g;
    const memberIds: Set<number> = new Set();
    let match;

    while ((match = mentionPattern.exec(content)) !== null) {
      memberIds.add(parseInt(match[1]));
    }

    const mentionIdMap: Record<number, number> = {};

    for (const memberId of memberIds) {
      const mention = await prisma.serverMention.create({
        data: {
          messageId: message.id,
          memberId,
        },
      });

      mentionIdMap[memberId] = mention.id;
    }

    let updatedContent = content;
    for (const memberId in mentionIdMap) {
      const mentionId = mentionIdMap[memberId];
      updatedContent = updatedContent.replace(
        new RegExp(`<@${memberId}>`, 'g'),
        `<@${mentionId}>`
      );
    }

    const updatedMessage = await prisma.serverMessage.update({
      where: {
        id: message.id,
      },
      data: {
        content: updatedContent,
        updatedAt: message.createdAt,
      },
      include: {
        channel: true,
        sender: {
          include: {
            user: true,
          },
        },
        mentions: {
          include: {
            member: true,
          },
        },
      },
    });

    return updatedMessage;
  });
