import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ChannelMembers from './ChannelMembers';

type TChannelSidebarProps = {
  serverId: number;
  channelId: number;
};

const ChannelMembersSidebar: React.FC<TChannelSidebarProps> = async ({
  serverId,
  channelId,
}) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
      serverId: serverId,
    },
    include: {
      server: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!channel) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ChannelMembers members={channel.server.members} />
    </div>
  );
};

export default ChannelMembersSidebar;
