'use client';
import { useModal } from '@/hooks/useModalStore';
import { Server } from '@prisma/client';
import { PlusCircle, UserPlus } from 'lucide-react';
import React, { ComponentProps, PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TChannelsContextMenuProps = {
  server: Server;
};

const ChannelsContextMenu: React.FC<
  TChannelsContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ server, children, ...props }) => {
  const { openModal } = useModal();

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Create Channel',
          icon: PlusCircle,
          onClick: () => {
            openModal('createChannel', { server });
          },
        },
        {
          label: 'Invite People',
          icon: UserPlus,
          variant: 'blue',
          onClick: () => {
            openModal('invite', { server });
          },
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ChannelsContextMenu;
