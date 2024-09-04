'use client';
import { deleteMessage } from '@/features/server/channel/delete-message/delete-message.action';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/hooks/useModalStore';
import { checkMessage } from '@/lib/utils/message.utils';
import { ClipboardCopy, Fingerprint, Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { ComponentProps, PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TChannelMessageContextMenuProps = {
  member: MemberWithUser;
  currentMember: MemberWithUser;
  message: ServerMessageWithSender;
};

const ChannelMessageContextMenu: React.FC<
  TChannelMessageContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ member, currentMember, message, children, ...props }) => {
  const { canDeleteMessage } = checkMessage(member, currentMember, message);

  const { execute } = useAction(deleteMessage, {});

  const { openModal } = useModal();
  const { toast } = useToast();

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Copy Text',
          icon: ClipboardCopy,
          onClick: async () => {
            await navigator.clipboard.writeText(message.content);
          },
        },
        {
          label: 'Delete Message',
          icon: Trash,
          variant: 'destructive',
          onClick: () => {},
          when: canDeleteMessage,
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
