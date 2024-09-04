'use server';

import prisma from '@/lib/prisma';
import { ServerMessage } from '@prisma/client';

export const formatMessageMention = async (
  message: ServerMessage,
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
    const mention = await prisma.serverMention.create({
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

  const data: Partial<ServerMessage> = {
    content: updatedContent,
  };
  if (isNewMessage) {
    data.updatedAt = message.createdAt;
  }
  return await prisma.serverMessage.update({
    where: {
      id: message.id,
    },
    data,
    include: {
      channel: true,
      sender: {
        include: {
          user: true,
        },
      },
      mentions: {
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      },
      reactions: {
        include: {
          members: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
