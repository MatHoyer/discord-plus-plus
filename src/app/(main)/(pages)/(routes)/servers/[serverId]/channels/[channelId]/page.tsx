'use server';

import ChannelChatInput from '@/components/channel/ChannelChatInput';
import ChannelHeader from '@/components/channel/ChannelHeader';
import ScrollableChat from '@/components/channel/ScrollableChat';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ServerPage = async (
  props: PageParams<{ serverId: string; channelId: string }>
) => {
  const session = await auth();
  if (!session) {
    return redirect('/');
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: +props.params.serverId,
      userId: session.user.id,
    },
    include: {
      user: true,
    },
  });

  const channel = await prisma.channel.findUnique({
    where: {
      id: +props.params.channelId,
      serverId: +props.params.serverId,
    },
    include: {
      messages: {
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          deleted: false,
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
            },
          },
        },
      },
    },
  });

  const members = await prisma.member.findMany({
    where: {
      serverId: channel?.serverId,
    },
    include: {
      user: true,
    },
  });

  if (!channel || !currentMember) {
    return redirect('/');
  }

  return (
    <>
      <ChannelHeader name={channel.name} channelType={channel.type} />
      {channel.type === 'TEXT' && (
        <>
          <ScrollableChat
            channel={channel as ChannelWithMessages}
            currentMember={currentMember}
            members={members}
          />
          <ChannelChatInput
            channel={channel}
            currentMember={currentMember}
            members={members}
          />
        </>
      )}
    </>
  );
};

export default ServerPage;
