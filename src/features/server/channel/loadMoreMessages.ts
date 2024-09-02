'use server';
import prisma from '@/lib/prisma';

export const loadMoreMessages = async (channelId: number, skip: number) => {
  const messages = await prisma.serverMessage.findMany({
    where: {
      channelId,
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
    },
  });

  return messages as ServerMessageWithSender[];
};
