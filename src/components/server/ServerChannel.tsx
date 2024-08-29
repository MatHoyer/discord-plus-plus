'use client';
import { cn, iconMap } from '@/lib/utils';
import { Channel, MemberRole, Server } from '@prisma/client';
import { Edit, Lock, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ActionTooltip from '../ActionTooltip';

type TServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const ServerChannel: React.FC<TServerChannelProps> = ({
  channel,
  server,
  role,
}) => {
  const params = useParams();
  const router = useRouter();
  const { channelId, serverId } = params;
  const isSelected = +channelId === channel.id;
  const Icon = iconMap[channel.type];

  return (
    <button
      onClick={() => {
        router.push(`/servers/${serverId}/channels/${channel.id}`);
      }}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-colors mb-1',
        isSelected && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors',
          isSelected &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className={cn(
                'hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors',
                isSelected && 'block'
              )}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className={cn(
                'hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors',
                isSelected && 'block'
              )}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
