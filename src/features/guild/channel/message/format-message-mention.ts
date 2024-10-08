'use server';

import prisma from '@/lib/prisma';
import { MESSAGE_INCLUDES } from '@/lib/utils/message.utils';
import { Message } from '@prisma/client';

export const formatMessageMention = async (
  message: Message,
  isNewMessage: boolean
) => {
  const { content, id } = message;
  const mentionPattern = /<@(\w+)>/g;
  const memberIds: Set<number> = new Set();
  let match: string[] | null;

  while ((match = mentionPattern.exec(content)) !== null) {
    memberIds.add(parseInt(match[1]));
  }

  const mentionIdMap: Record<number, number> = {};

  for (const memberId of memberIds) {
    const mention = await prisma.mention.create({
      data: {
        messageId: id,
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

  const data: Partial<Message> = {
    content: updatedContent,
  };
  if (isNewMessage) {
    data.updatedAt = message.createdAt;
  }
  return await prisma.message.update({
    where: {
      id: message.id,
    },
    data,
    ...MESSAGE_INCLUDES,
  });
};
