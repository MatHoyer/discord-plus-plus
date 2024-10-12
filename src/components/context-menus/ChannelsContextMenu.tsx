'use client';
import { openModal } from '@/hooks/useModalStore';
import { Guild } from '@prisma/client';
import { PlusCircle, UserPlus } from 'lucide-react';
import React, { ComponentProps, PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TChannelsContextMenuProps = {
  guild: Guild;
};

const ChannelsContextMenu: React.FC<
  TChannelsContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ guild, children, ...props }) => {
  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Create Channel',
          icon: PlusCircle,
          onClick: () => {
            openModal('createChannel', { guild });
          },
        },
        {
          label: 'Invite People',
          icon: UserPlus,
          variant: 'blue',
          onClick: () => {
            openModal('invite', { guild });
          },
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ChannelsContextMenu;
