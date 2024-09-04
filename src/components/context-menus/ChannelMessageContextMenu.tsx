'use client';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/hooks/useModalStore';
import { AtSign, ClipboardCopy, Fingerprint } from 'lucide-react';
import React, { PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TChannelMessageContextMenuProps = {
  member: MemberWithUser;
  message: ServerMessageWithSender;
};

const ChannelMessageContextMenu: React.FC<
  TChannelMessageContextMenuProps & PropsWithChildren
> = ({ member, message, children }) => {
  const { openModal } = useModal();
  const { toast } = useToast();

  return (
    <GenericContextMenu
      items={[
        {
          label: 'Copy Text',
          icon: ClipboardCopy,
          onClick: async () => {
            await navigator.clipboard.writeText(message.content);
          },
        },
        {
          label: 'Mention',
          icon: AtSign,
        },
        {
          seperator: true,
        },
        {
          label: 'Copy Message ID',
          icon: Fingerprint,
          onClick: async () => {
            await navigator.clipboard.writeText(message.id.toString());
          },
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ChannelMessageContextMenu;
