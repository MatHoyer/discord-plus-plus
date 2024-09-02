'use server';

import ChatInput from '@/components/channel/ChatInput';
import ScrollableChat from '@/components/channel/ScrollableChat';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { iconMap } from '@/lib/utils';
import { redirect } from 'next/navigation';

const ServerPage = async (
  props: PageParams<{ serverId: string; channelId: string }>
) => {
  const session = await auth();

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

  if (!channel || !session) {
    return redirect('/');
  }

  const Icon = iconMap[channel.type];

  return (
    <>
      <div className="h-[48px] flex items-center pl-5 border-neutral-200 dark:border-neutral-800 border-b-2">
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        <h1 className="text-md font-semibold">{channel.name}</h1>
      </div>
      {channel.type === 'TEXT' && (
        <>
          <ScrollableChat channel={channel as ChannelWithMessages} />
          <ChatInput channel={channel} />
        </>
      )}
    </>
  );
};

export default ServerPage;
