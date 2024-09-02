'use server';

import ChannelHeader from '@/components/channel/ChannelHeader';
import ChatInput from '@/components/channel/ChatInput';
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
        include: {
          sender: {
            include: {
              user: true,
            },
          },
        },
      },
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
          />
          <ChatInput channel={channel} />
        </>
      )}
    </>
  );
};

export default ServerPage;
