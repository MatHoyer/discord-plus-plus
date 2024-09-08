'use server';

import ChannelChatInput from '@/components/channel/ChannelChatInput';
import ChannelHeader from '@/components/channel/ChannelHeader';
import ScrollableChat from '@/components/channel/ScrollableChat';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MESSAGE_INCLUDES, MESSAGE_TOP_LIMIT } from '@/lib/utils/message.utils';
import { redirect } from 'next/navigation';

const GuildPage = async (
  props: PageParams<{ guildId: string; channelId: string }>
) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }
  const guildId = +props.params.guildId;

  const currentMember = await prisma.userGuildProfile.findFirst({
    where: {
      guildId,
      userId: session.user.id,
    },
    include: {
      user: true,
    },
  });

  const channel = await prisma.channel.findUnique({
    where: {
      id: +props.params.channelId,
      guildId,
    },
    include: {
      messages: {
        take: MESSAGE_TOP_LIMIT,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          deleted: false,
        },
        ...MESSAGE_INCLUDES,
      },
    },
  });

  const members = await prisma.userGuildProfile.findMany({
    where: {
      guildId,
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
            channel={channel}
            currentMember={currentMember}
            members={members}
            user={session.user}
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

export default GuildPage;
