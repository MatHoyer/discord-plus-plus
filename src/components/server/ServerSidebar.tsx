import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Channeltype } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';

type TServerSidebarProps = {
  serverId: number;
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

  const role = server.members.find((member) => member.userId === userId)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
