'use client';
import { reactToMessage } from '@/features/server/channel/message/react-to-message/react-to-message.action';
import { checkMessage } from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { ClipboardCopy, Fingerprint, SmilePlus, Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { ComponentProps, PropsWithChildren } from 'react';
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
  const { canDeleteMessage } = checkMessage(member, currentMember, message);

  const { execute } = useAction(reactToMessage, {
    onSuccess: ({ data }) => {
      if (typeof data === 'number') {
        socket.emit('delete-reaction', {
          reactionId: data,
          channelId: channel!.id,
        });
      } else {
        socket.emit('reacted-to-message', {
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
                execute({
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
