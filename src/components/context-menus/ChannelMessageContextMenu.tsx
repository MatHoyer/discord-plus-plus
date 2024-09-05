'use client';
import { useDeleteMessage } from '@/features/server/channel/message/delete-message/delete-message.hook';
import { reactToMessage } from '@/features/server/channel/message/react-to-message/react-to-message.action';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useModal } from '@/hooks/useModalStore';
import { checkMessage } from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import {
  ClipboardCopy,
  Edit,
  Fingerprint,
  SmilePlus,
  Trash,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { ServerSocketEvents } from '../../../server/socket/server';
import GenericContextMenu, { isSeparator } from './GenericContextMenu';

type TChannelMessageContextMenuProps = {
  member: MemberWithUser;
  currentMember: MemberWithUser;
  message: ServerMessageWithSender;
  channel?: Channel;
};

const EMOJIS = [
  {
    label: 'Slip de mathieu',
    content: '🩲',
  },
  {
    label: 'Banane',
    content: '🍌',
  },
];

const ChannelMessageContextMenu: React.FC<
  TChannelMessageContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ member, currentMember, message, channel, children, ...props }) => {
  const { canDeleteMessage, canEditMessage } = checkMessage(
    member,
    currentMember,
    message
  );

  const { openModal } = useModal();
  const { execute: deleteMessage } = useDeleteMessage();
  const setEditingMessageId = useGlobalStore(
    (state) => state.setEditingMessageId
  );

  const { execute: react } = useAction(reactToMessage, {
    onSuccess: ({ data }) => {
      if (typeof data === 'number') {
        socket.emit(ServerSocketEvents.deleteReaction, {
          reactionId: data,
          channelId: channel!.id,
        });
      } else {
        socket.emit(ServerSocketEvents.reactedToMessage, {
          reaction: data,
          channelId: channel!.id,
        });
      }
    },
  });

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Add Reaction',
          subItems: [
            ...EMOJIS.map((emoji) => ({
              ...emoji,
              customRender: (item) =>
                isSeparator(item) ? null : (
                  <>
                    {item.label}{' '}
                    <span className="ml-auto text-md">{emoji.content}</span>
                  </>
                ),
              onClick: () => {
                react({
                  messageId: message.id,
                  memberId: currentMember.id,
                  content: emoji.content,
                });
              },
            })),
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
          label: 'Edit Message',
          icon: Edit,
          when: canEditMessage,
          onClick: () => {
            setEditingMessageId(message.id);
          },
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
          onClick: ({ e }) => {
            if (e.shiftKey) {
              deleteMessage({
                channelId: message.channelId,
                messageId: message.id,
                serverId: channel!.serverId,
              });
            } else {
              openModal('deleteChannelMessage', {
                serverMessage: message,
                currentMember,
                channel,
              });
            }
          },
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
