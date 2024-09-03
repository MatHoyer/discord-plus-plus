import { editMessage } from '@/features/server/channel/edit-message/edit-message.action';
import {
  editMessageSchema,
  TEditMessage,
} from '@/features/server/channel/edit-message/edit-message.schema';
import { useModal } from '@/hooks/useModalStore';
import { checkRole, cn } from '@/lib/utils';
import { socket } from '@/socket';
import { Channel, Member } from '@prisma/client';
import { isEqual } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import ActionTooltip from '../ActionTooltip';
import ProfileContextMenu from '../context-menus/ProfileContextMenu';
import { modal } from '../Modal';
import ProfilePopover from '../profile/ProfilePopover';
import { roleIconMap } from '../server/ServerSidebar';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';
import { Input } from '../ui/input';
import UserAvatar from '../UserAvatar';

type TChannelMessageProps = {
  time: string;
  message: ServerMessageWithSender;
  currentMember: Member;
  channel?: Channel;
  preview?: boolean;
};

const ChannelMessage: React.FC<TChannelMessageProps> = ({
  time,
  message,
  currentMember,
  channel,
  preview = false,
}) => {
  const { openModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const member = message.sender;
  const { isAdmin, isModerator } = checkRole(currentMember.role);
  const isUpdated = !isEqual(message.createdAt, message.updatedAt);
  const isDeleted = message.deleted;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !isDeleted && isOwner;

  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, result: state } = useAction(editMessage, {
    onSuccess: ({ data }) => {
      setIsEditing(false);
      socket.emit('edit-message', data);
    },
  });

  const form = useZodForm({
    schema: editMessageSchema,
    defaultValues: {
      content: message.content,
      messageId: message.id,
      channelId: message.channelId,
      serverId: message.sender.serverId,
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
        form.reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [form]);

  const onError = (errors: FieldErrors<TEditMessage>) => {
    if (errors.content) {
      modal.error({
        title: 'Your message is too long',
        message: errors.content.message,
      });
    }
  };

  const parsedMessage = useMemo(() => {
    const parts = message.content.split(/(<@\w+>)/g);
    return parts.map((part, index) => {
      const match = part.match(/^<@(\w+)>$/);
      if (match) {
        const mentionId = +match[1];
        const mention = message.mentions?.find((m) => m.id === mentionId);
        if (mention) {
          return (
            <ProfileContextMenu key={index} member={mention.member}>
              <ProfilePopover member={mention.member} asChild>
                <span className="text-white p-1 bg-[#3c4270] bg-opacity-50 hover:bg-[#5864f3] hover:bg-opacity-100 font-semibold rounded-sm transition-colors hover:underline cursor-pointer select-none">
                  @{mention.member.username}
                </span>
              </ProfilePopover>
            </ProfileContextMenu>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  }, [message.content, message.mentions]);

  const isMentionned = message.mentions?.some(
    (mention) => mention.member.id === currentMember.id
  );

  return (
    <div
      className={cn(
        'relative group flex items-center px-4 py-2 mb-2 transition-colors w-full',
        isMentionned && 'bg-[#444037] bg-opacity-70',
        !isMentionned && 'hover:bg-black/5'
      )}
    >
      {isMentionned && (
        <div className="absolute left-0 w-1 h-full bg-[#f0b132]" />
      )}
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className={cn(
            'hover:drop-shadow-md transition',
            !preview && 'cursor-pointer '
          )}
        >
          <ProfilePopover member={member} asChild={false}>
            <UserAvatar src={member.user.image} />
          </ProfilePopover>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2 mb-1">
            <div className="flex items-center gap-x-2">
              <ProfilePopover member={member}>
                <p
                  className={cn(
                    'font-semibold text-sm',
                    !preview && 'hover:underline cursor-pointer'
                  )}
                >
                  {member.username}
                </p>
              </ProfilePopover>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {time}
            </span>
          </div>
          {!isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300 break-all'
              )}
            >
              {parsedMessage}
              {isUpdated && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 select-none">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!preview && isEditing && (
            <Form {...form} state={state}>
              <form
                onSubmit={form.handleSubmit(execute, onError)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            {...field}
                            ref={inputRef}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
              <span className="text-[10px] mt-1 text-zinc-400 select-none">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {!preview && canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              onClick={() => {
                openModal('deleteChannelMessage', {
                  serverMessage: message,
                  currentMember,
                  channel,
                });
              }}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChannelMessage;
