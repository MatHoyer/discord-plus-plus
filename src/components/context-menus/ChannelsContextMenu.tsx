'use client';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/hooks/useModalStore';
import { Server } from '@prisma/client';
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
  const { toast } = useToast();

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Create Channel',
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ChannelsContextMenu;
