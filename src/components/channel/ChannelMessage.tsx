import { editMessage } from '@/features/server/channel/message/edit-message/edit-message.action';
import {
  editMessageSchema,
  TEditMessage,
} from '@/features/server/channel/message/edit-message/edit-message.schema';
import { useModal } from '@/hooks/useModalStore';
import { cn } from '@/lib/utils';
import { checkMessage, parseMentionsMessage } from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { differenceInMinutes, format, isEqual } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ServerSocketEvents } from '../../../server/socket/server';
import ActionTooltip from '../ActionTooltip';
import ChannelMessageContextMenu from '../context-menus/ChannelMessageContextMenu';
import ProfileContextMenu from '../context-menus/ProfileContextMenu';
import ChatInput from '../form/ChatInput';
import ProfilePopover from '../profile/ProfilePopover';
import MessageReactions from '../reaction/MessageReactions';
import { roleIconMap } from '../server/ServerSidebar';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';
import UserAvatar from '../UserAvatar';

type TChannelMessageProps = {
  time: string;
  message: ServerMessageWithSender;
  previousMessage?: ServerMessageWithSender;
  currentMember: MemberWithUser;
  channel?: Channel;
  preview?: boolean;
  members?: MemberWithUser[];
};

const ChannelMessage: React.FC<TChannelMessageProps> = ({
  time,
  message,
  previousMessage,
  currentMember,
  channel,
  preview = false,
  members,
}) => {
  const { openModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const member = message.sender;
  const isUpdated = !isEqual(message.createdAt, message.updatedAt);

  const { canDeleteMessage, canEditMessage } = checkMessage(
    member,
    currentMember,
    message
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const { execute, result: state } = useAction(editMessage, {
    onSuccess: ({ data }) => {
      setIsEditing(false);
      socket.emit(ServerSocketEvents.editMessage, data);
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

  const parsedMessage = useMemo(() => {
    const parts = message.content.split(/(<@\w+>)/g);
    return parts.map((part, index) => {
      const match = part.match(/^<@(\w+)>$/);
      if (match) {
        const mentionId = +match[1];
        const mention = message.mentions?.find((m) => m.id === mentionId);
        if (mention) {
          return (
            <ProfileContextMenu
              key={index}
              member={mention.member}
              disabled={preview}
            >
              <ProfilePopover
                member={mention.member}
                asChild
                disabled={preview}
              >
                <span
                  className={cn(
                    'text-white p-1 bg-[#3c4270] bg-opacity-50 font-semibold rounded-sm select-none',
                    !preview &&
                      'hover:bg-[#5864f3] hover:bg-opacity-100 transition-colors hover:underline cursor-pointer'
                  )}
                >
                  @{mention.member.username}
                </span>
              </ProfilePopover>
            </ProfileContextMenu>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  }, [message.content, message.mentions, preview]);

  const isMentionned = message.mentions?.some(
    (mention) => mention.member.id === currentMember.id
  );

  const handleSubmit = (v: TEditMessage) => {
    const parsedContent = parseMentionsMessage(v.content);

    execute({ ...v, content: parsedContent });
  };

  const isSameSender =
    previousMessage &&
    previousMessage.sender.id === currentMember.id &&
    differenceInMinutes(
      new Date(previousMessage.createdAt),
      new Date(message.createdAt)
    ) <= 10;

  return (
    <ChannelMessageContextMenu
      member={member}
      currentMember={currentMember}
      message={message}
      disabled={preview}
      channel={channel}
    >
      <div
        className={cn(
          'relative group flex items-center px-4 transition-colors w-full',
          isMentionned
            ? 'bg-[#444037]/70 hover:bg-[#403d38]/50'
            : 'hover:bg-black/5',
          isSameSender ? 'mb-0 py-[1px]' : 'mb-2 py-2'
        )}
      >
        {isMentionned && (
          <div className="absolute left-0 w-1 h-full bg-[#f0b132]" />
        )}
        <div className="group flex gap-x-2 items-start w-full">
          <div
            className={cn(
              'hover:drop-shadow-md transition',
              !preview && !isSameSender && 'cursor-pointer'
            )}
          >
            {isSameSender ? (
              <div className="h-7 w-10 flex items-center">
                <span className="hidden group-hover:flex text-xs text-zinc-500 dark:text-zinc-400">
                  {format(new Date(message.createdAt), "HH':'mm")}
                </span>
              </div>
            ) : (
              <ProfileContextMenu member={member} disabled={preview}>
                <ProfilePopover
                  member={member}
                  asChild={false}
                  disabled={preview}
                >
                  <UserAvatar
                    src={member.user.image}
                    className={preview ? 'cursor-auto' : undefined}
                  />
                </ProfilePopover>
              </ProfileContextMenu>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2 mb-1">
              {!isSameSender && (
                <>
                  <div className="flex items-center gap-x-2">
                    <ProfileContextMenu member={member} disabled={preview}>
                      <ProfilePopover member={member} disabled={preview}>
                        <p
                          className={cn(
                            'font-semibold text-sm',
                            !preview && 'hover:underline cursor-pointer'
                          )}
                        >
                          {member.username}
                        </p>
                      </ProfilePopover>
                    </ProfileContextMenu>
                    <ActionTooltip label={member.role}>
                      {roleIconMap[member.role]}
                    </ActionTooltip>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {time}
                  </span>
                </>
              )}
            </div>
            {!isEditing && (
              <>
                <p
                  className={cn(
                    'text-sm text-zinc-600 dark:text-zinc-300 break-all mb-1'
                  )}
                >
                  {parsedMessage}
                  {isUpdated && (
                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 select-none">
                      (edited)
                    </span>
                  )}
                </p>
                <MessageReactions
                  reactions={message.reactions}
                  currentMember={currentMember}
                  channel={channel}
                />
              </>
            )}
            {!preview && isEditing && (
              <Form {...form} state={state}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex items-center w-full gap-x-2 pt-2"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <ChatInput
                            inputRef={inputRef}
                            members={members!}
                            onSubmit={form.handleSubmit(handleSubmit)}
                            value={field.value}
                            onInput={field.onChange}
                            offset={4.8}
                          />
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
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm z-20">
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
    </ChannelMessageContextMenu>
  );
};

export default ChannelMessage;
