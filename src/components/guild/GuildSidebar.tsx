import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Channeltype, ProfileRole } from '@prisma/client';
import { Hash, ShieldAlert, ShieldCheck, Volume2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import ChannelsContextMenu from '../context-menus/ChannelsContextMenu';
import SideBarProfile from '../profile/SideBarProfile';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import GuildChannels from './GuildChannels';
import GuildHeader from './GuildHeader';
import GuildSearch from './GuildSearch';

type TServerSidebarProps = {
  guildId: number;
};

export const channelTypeIconMap = {
  [Channeltype.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [Channeltype.AUDIO]: <Volume2 className="mr-2 h-4 w-4" />,
};

export const roleIconMap = {
  [ProfileRole.GUEST]: null,
  [ProfileRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [ProfileRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const GuildSidebar: React.FC<TServerSidebarProps> = async ({ guildId }) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const userId = session.user.id;

  const guild = await prisma.guild.findUnique({
    where: {
      id: guildId,
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

  if (!guild) {
    return redirect('/');
  }

  const textChannels = guild.channels.filter(
    (channel) => channel.type === Channeltype.TEXT
  );

  const audioChannels = guild.channels.filter(
    (channel) => channel.type === Channeltype.AUDIO
  );

  const members = guild.members.filter((member) => member.userId !== userId);

  const currentMember = guild.members.find(
    (member) => member.userId === userId
  );
  const role = currentMember?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <GuildHeader guild={guild} role={role} />
      <ChannelsContextMenu guild={guild} triggerClassName="flex-1">
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <GuildSearch
              guildId={guildId}
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
          <GuildChannels
            guild={guild}
            channels={{ textChannels, audioChannels }}
            role={role}
          />
        </ScrollArea>
      </ChannelsContextMenu>
      <SideBarProfile user={session.user} currentMember={currentMember!} />
    </div>
  );
};

export default GuildSidebar;
