import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Channeltype, MemberRole } from '@prisma/client';
import { Hash, ShieldAlert, ShieldCheck, Volume2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import ChannelsContextMenu from '../context-menus/ChannelsContextMenu';
import SideBarProfile from '../profile/SideBarProfile';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import ServerChannels from './ServerChannels';
import ServerHeader from './ServerHeader';
import ServerSearch from './ServerSearch';

type TServerSidebarProps = {
  serverId: number;
};

export const channelTypeIconMap = {
  [Channeltype.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [Channeltype.AUDIO]: <Volume2 className="mr-2 h-4 w-4" />,
};

export const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerSidebar: React.FC<TServerSidebarProps> = async ({ serverId }) => {
  const session = await auth();
  if (!session) {
    return redirect('/');
  }

  const userId = session.user.id;

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === Channeltype.TEXT
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === Channeltype.AUDIO
  );

  const members = server.members.filter((member) => member.userId !== userId);

  const currentMember = server.members.find(
    (member) => member.userId === userId
  );
  const role = currentMember?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ChannelsContextMenu server={server} triggerClassName="flex-1">
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              serverId={serverId}
              data={[
                {
                  label: 'Text Channels',
                  type: 'channel',
                  rows: textChannels?.map((channel) => ({
                    icon: channelTypeIconMap[channel.type],
                    name: channel.name,
                    id: channel.id,
                  })),
                },
                {
                  label: 'Voice Channels',
                  type: 'channel',
                  rows: audioChannels?.map((channel) => ({
                    icon: channelTypeIconMap[channel.type],
                    name: channel.name,
                    id: channel.id,
                  })),
                },
                {
                  label: 'Members',
                  type: 'member',
                  rows: members?.map((member) => ({
                    icon: roleIconMap[member.role],
                    name: member.user.name!,
                    id: member.user.id,
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          <ServerChannels
            server={server}
            channels={{ textChannels, audioChannels }}
            role={role}
          />
        </ScrollArea>
      </ChannelsContextMenu>
      <SideBarProfile />
    </div>
  );
};

export default ServerSidebar;
