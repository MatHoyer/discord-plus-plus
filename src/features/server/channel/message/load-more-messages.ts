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
      referencedMessage: {
        include: {
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
