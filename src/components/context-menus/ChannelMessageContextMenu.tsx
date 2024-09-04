'use client';
import { deleteMessage } from '@/features/server/channel/message/delete-message/delete-message.action';
import { checkMessage } from '@/lib/utils/message.utils';
import {
  ClipboardCopy,
  Fingerprint,
  Shirt,
  SmilePlus,
  Trash,
} from 'lucide-react';
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

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Add Reaction',
          subItems: [
            {
              label: 'Slip de mathieu',
              icon: Shirt,
              onClick: () => {},
            },
            {
              seperator: true,
            },
            {
              label: 'View More',
              icon: SmilePlus,
            },
          ],
        },
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
