import { useDeleteMessage } from '@/features/server/channel/message/delete-message/delete-message.hook';
import { editMessage } from '@/features/server/channel/message/edit-message/edit-message.action';
import {
  editMessageSchema,
  TEditMessage,
} from '@/features/server/channel/message/edit-message/edit-message.schema';
import { useEventListener } from '@/hooks/useEventListener';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useModal } from '@/hooks/useModalStore';
import { cn } from '@/lib/utils';
import {
  checkMessage,
  mentionToSpan,
  spanToMention,
} from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { differenceInMinutes, format, isEqual } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useMemo, useRef } from 'react';
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
  onReferencedMessageClicked?: (message: ServerMessageWithSender) => void;
};

const ChannelMessage: React.FC<TChannelMessageProps> = ({
  time,
  message,
  previousMessage,
  currentMember,
  channel,
  preview = false,
  members,
  onReferencedMessageClicked,
}) => {
  const { openModal } = useModal();
  const {
    editingMessageId,
    setEditingMessageId,
    replyingToMessage,
    flashReferencedMessageId,
  } = useGlobalStore((state) => ({
    editingMessageId: state.editingMessageId,
    setEditingMessageId: state.setEditingMessageId,
    replyingToMessage: state.replyingToMessage,
    flashReferencedMessageId: state.flashReferencedMessageId,
  }));

  if (!message.reactions) {
    console.log('HERERHEHREHREH', message.id);
  }
  const { execute: deleteMessag } = useDeleteMessage();

  const isEditing = editingMessageId === message.id;

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
      setEditingMessageId(undefined);
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

  useEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        setEditingMessageId(undefined);
        form.reset();
      }
    },
    [form]
  );

  const parsedMessage = useMemo(
    () => mentionToSpan(message, preview),
    [message, preview]
  );

  const parsedReferencedMessage = useMemo(
    () =>
      message.referencedMessage
        ? mentionToSpan(message.referencedMessage, preview)
        : [],
    [message.referencedMessage, preview]
  );

  const isFlashing = flashReferencedMessageId === message.id;

  const isCurrentReplyingToMessage = replyingToMessage?.id === message.id;

  const isMentionned =
    (message.mentions?.some(
      (mention) => mention.member.id === currentMember.id
    ) ||
      (message.referencedMessage?.senderId === currentMember.id &&
        message.senderId !== currentMember.id)) &&
    !isCurrentReplyingToMessage &&
    !isFlashing;

  const handleSubmit = (v: TEditMessage) => {
    const parsedContent = spanToMention(v.content);

    execute({ ...v, content: parsedContent });
  };

  const isSameSender =
    previousMessage &&
    previousMessage.senderId === message.senderId &&
    differenceInMinutes(
      new Date(message.createdAt),
      new Date(previousMessage.createdAt)
    ) <= 10 &&
    !message.referencedMessage;

  return (
    <ChannelMessageContextMenu
      member={member}
      currentMember={currentMember}
      message={message}
      disabled={preview}
      channel={channel}
    >
      <div
        data-message-id={message.id}
        className={cn(
          'relative transition-colors group',
          isMentionned
            ? 'bg-[#444037]/70 hover:bg-[#444037]/50 '
            : 'hover:bg-black/5',
          isSameSender ? 'mb-0 py-[1px]' : 'mb-2 py-2',
          isCurrentReplyingToMessage && 'bg-[#393c48] hover:bg-[#35384a]',
          isFlashing && 'bg-[#393c48] hover:bg-[#35384a]'
        )}
      >
        {message.referencedMessage && (
          <div className="before:content-[''] before:absolute before:border-zinc-500 before:left-[28px] before:top-[16px] before:w-[22px] md:before:left-[35px] md:before:top-[15px] md:before:w-[25px] before:h-[11px] before:rounded-tl-md before:border-0 before:border-t-2 before:border-l-2 ml-[53px] md:ml-16 mb-[1.5px] text-xs text-zinc-400 flex gap-1 items-center">
            <ProfileContextMenu
              member={message.referencedMessage.sender}
              disabled={preview}
            >
              <ProfilePopover
                member={message.referencedMessage.sender}
                asChild={false}
                disabled={preview}
                triggerProps={{
                  className: 'flex gap-1',
                }}
              >
                <UserAvatar
                  src={message.referencedMessage.sender.user.image}
                  size="xxs"
                  className="mt-[6px] md:mt-[1.5px]"
                />
                <p
                  className={cn(
                    'font-bold text-sm',
                    !preview && 'hover:underline cursor-pointer'
                  )}
                >
                  {message.referencedMessage.sender.username}
                </p>
              </ProfilePopover>
            </ProfileContextMenu>

            <div
              className="hover:text-zinc-200 transition-colors cursor-pointer"
              onClick={() => {
                onReferencedMessageClicked?.(message.referencedMessage);
              }}
            >
              {parsedReferencedMessage}
            </div>
          </div>
        )}
        <div
          className={cn(
            'group flex items-center px-4 transition-colors w-full'
          )}
        >
          {(isMentionned || isCurrentReplyingToMessage) && (
            <div
              className={cn(
                'absolute left-0 bottom-0 w-1 h-full',
                isMentionned && 'bg-[#f0b132]',
                isCurrentReplyingToMessage && 'bg-[#5865f2]'
              )}
            />
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
            <div
              className={cn(
                'flex flex-col w-full',
                message.reactions.length > 0 && 'mb-1'
              )}
            >
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
                              xOffset={4.8}
                              yOffset={message.reactions.length > 0 ? 110 : 85}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                  <span className="text-[10px] mt-1 text-zinc-400 select-none">
                    escape to cancel, enter to save
                  </span>
                </Form>
              )}
              <MessageReactions
                reactions={message.reactions}
                currentMember={currentMember}
                channel={channel}
              />
            </div>
          </div>
          {!preview && canDeleteMessage && !isEditing && (
            <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm z-20">
              {canEditMessage && (
                <ActionTooltip label="Edit">
                  <Edit
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    onClick={() => {
                      setEditingMessageId(message.id);
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
                  onClick={(e) => {
                    if (e.shiftKey) {
                      deleteMessag({
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
                  }}
                />
              </ActionTooltip>
            </div>
          )}
        </div>
      </div>
    </ChannelMessageContextMenu>
  );
};

export default ChannelMessage;
