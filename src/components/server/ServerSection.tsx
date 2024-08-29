'use client';
import { useModal } from '@/hooks/useModalStore';
import { Channeltype, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import React from 'react';
import ActionTooltip from '../ActionTooltip';

type TServerSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: Channeltype;
  server?: TServerWithMembersAndProfiles;
};

const ServerSection: React.FC<TServerSectionProps> = ({
  label,
  sectionType,
  channelType,
  role,
  server,
}) => {
  const { openModal } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => openModal('createChannel', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => openModal('members', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
