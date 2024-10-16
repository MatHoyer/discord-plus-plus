'use client';
import { openModal } from '@/hooks/useModalStore';
import { ProfileRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import React from 'react';
import ActionTooltip from '../ActionTooltip';

type TServerSectionProps = {
  label: string;
  role?: ProfileRole;
  sectionType: 'channels' | 'members';
  guild?: TGuildWithMembersAndProfiles;
};

const GuildSection: React.FC<TServerSectionProps> = ({
  label,
  sectionType,
  role,
  guild,
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== ProfileRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => openModal('createChannel', { guild })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === ProfileRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Create channel" side="top">
          <button
            onClick={() => openModal('members', { guild })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default GuildSection;
