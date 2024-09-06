'use server';

import prisma from '@/lib/prisma';
import { MESSAGE_TOP_LIMIT } from '@/lib/utils/message.utils';

export const loadMoreMessages = async (channelId: number, skip: number) => {
  const messages = await prisma.serverMessage.findMany({
    where: {
      channelId,
      deleted: false,
    },
    skip: skip,
    take: MESSAGE_TOP_LIMIT,
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
