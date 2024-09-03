'use server';
import prisma from '@/lib/prisma';

export const loadMoreMessages = async (channelId: number, skip: number) => {
  const messages = await prisma.serverMessage.findMany({
    where: {
      channelId,
      deleted: false,
    },
    skip: skip,
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
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

  const messagesCount = await prisma.serverMessage.count({
    where: {
      channelId,
      deleted: false,
    },
  });

  return { messages, messagesCount } as {
    messages: ServerMessageWithSender[];
    messagesCount: number;
  };
};
