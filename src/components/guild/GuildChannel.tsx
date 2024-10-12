'use client';
import { openModal } from '@/hooks/useModalStore';
import { cn } from '@/lib/utils';
import { Channel, Channeltype, ProfileRole } from '@prisma/client';
import { Edit, Hash, Trash2, Volume2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ActionTooltip from '../ActionTooltip';

type TServerChannelProps = {
  channel: Channel;
  role?: ProfileRole;
  isUnread?: boolean;
  onClick?: (channelId: number) => void;
  setAsRead?: (channelId: number) => void;
  mentions?: number;
};

export const iconMap = {
  [Channeltype.TEXT]: Hash,
  [Channeltype.AUDIO]: Volume2,
};

const GuildChannel: React.FC<TServerChannelProps> = ({
  channel,
  role,
  isUnread,
  onClick,
  mentions,
}) => {
  const params = useParams();
  const router = useRouter();
  const { channelId, guildId } = params;
  const isSelected = +channelId === channel.id;
  const Icon = iconMap[channel.type];

  return (
    <div className="relative">
      {isUnread && (
        <div className="absolute top-[14px] left-[-3px] w-2 h-2 bg-primary rounded-full" />
      )}
      <button
        onClick={() => {
          router.push(`/channels/${guildId}/${channel.id}`);
          onClick?.(channel.id);
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
        <div className="ml-auto flex items-center gap-x-2">
          <div
            className={cn(
              'bg-[#f23f42] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs font-bold',
              (isSelected || mentions === 0) && 'hidden',
              role !== ProfileRole.GUEST &&
                channel.name !== 'general' &&
                'group-hover:hidden'
            )}
          >
            {mentions}
          </div>
          {channel.name !== 'general' && role !== ProfileRole.GUEST && (
            <>
              <ActionTooltip label="Edit">
                <Edit
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('editChannel', {
                      channel,
                    });
                  }}
                  className={cn(
                    'hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors',
                    isSelected && 'block'
                  )}
                />
              </ActionTooltip>
              <ActionTooltip label="Delete">
                <Trash2
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('deleteChannel', {
                      channel,
                      currentChannelId: +channelId,
                    });
                  }}
                  className={cn(
                    'hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors',
                    isSelected && 'block'
                  )}
                />
              </ActionTooltip>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default GuildChannel;
