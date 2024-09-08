'use server';

import prisma from '@/lib/prisma';
import { MESSAGE_INCLUDES, MESSAGE_TOP_LIMIT } from '@/lib/utils/message.utils';

export const loadMoreMessages = async (channelId: number, skip: number) => {
  const messages = await prisma.message.findMany({
    where: {
      channelId,
      deleted: false,
    },
    skip: skip,
    take: MESSAGE_TOP_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
    ...MESSAGE_INCLUDES,
  });

  const messagesCount = await prisma.message.count({
    where: {
      channelId,
      deleted: false,
    },
  });

  return { messages, messagesCount } as {
    messages: MessageWithSender[];
    messagesCount: number;
  };
};

export const loadMoreMessagesAround = async (
  channelId: number,
  referencedMessageId: number
) => {
  const beforeCount = Math.floor(MESSAGE_TOP_LIMIT / 2);
  const afterCount = MESSAGE_TOP_LIMIT - beforeCount - 1;

  const referencedMessage = await prisma.message.findUnique({
    where: {
      channelId,
      id: referencedMessageId,
    },
    ...MESSAGE_INCLUDES,
  });

  if (!referencedMessage) {
    throw new Error('Message not found');
  }

  const messagesBefore = await prisma.message.findMany({
    where: {
      channelId,
      deleted: false,
      createdAt: {
        lt: new Date(referencedMessage.createdAt),
      },
    },
    take: beforeCount,
    orderBy: {
      createdAt: 'desc',
    },
    ...MESSAGE_INCLUDES,
  });

  const messagesAfter = await prisma.message.findMany({
    where: {
      channelId,
      deleted: false,
      createdAt: {
        gt: new Date(referencedMessage.createdAt),
      },
    },
    take: afterCount,
    orderBy: {
      createdAt: 'asc',
    },
    ...MESSAGE_INCLUDES,
  });

  const messages = [
    ...messagesBefore.reverse(),
    referencedMessage,
    ...messagesAfter,
  ];

  return messages as MessageWithSender[];
};
