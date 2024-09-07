import { deleteAttachment } from '@/features/server/channel/message/delete-attachment/delete-attachment.action';
import { useDeleteMessage } from '@/features/server/channel/message/delete-message/delete-message.hook';
import { editMessage } from '@/features/server/channel/message/edit-message/edit-message.action';
import {
  editMessageSchema,
  TEditMessage,
} from '@/features/server/channel/message/edit-message/edit-message.schema';
import { useEventListener } from '@/hooks/useEventListener';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useModal } from '@/hooks/useModalStore';
import { cn, DateString, getDateAsString } from '@/lib/utils';
import {
  checkMessage,
  mentionToSpan,
  spanToMention,
} from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { differenceInMinutes, format, isEqual, isSameDay } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useMemo, useRef } from 'react';
import { ServerSocketEvents } from '../../../../server/socket/server';
import ActionTooltip from '../../ActionTooltip';
import ChannelMessageContextMenu from '../../context-menus/ChannelMessageContextMenu';
import ProfileContextMenu from '../../context-menus/ProfileContextMenu';
import ChatInput from '../../form/ChatInput';
import ProfilePopover from '../../profile/ProfilePopover';
import MessageReactions from '../../reaction/MessageReactions';
import { roleIconMap } from '../../server/ServerSidebar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useZodForm,
} from '../../ui/form';
import UserAvatar from '../../UserAvatar';
import MessageAttachments from './MessageAttachments';
import ReferencedMessage from './ReferencedMessage';

type TChannelMessageProps = {
  time: string;
  message: ServerMessageWithSender;
  previousMessage?: ServerMessageWithSender;
  nextMessage?: ServerMessageWithSender;
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
  nextMessage,
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

  const { execute: deleteMessage } = useDeleteMessage();
  const { execute: executeDeleteAttachment } = useAction(deleteAttachment, {
    onSuccess: ({ input }) => {
      socket.emit(ServerSocketEvents.deleteAttachment, {
        attachmentId: input.attachmentId,
        channelId: channel?.id,
      });
    },
  });

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

  const isPreviousMessageSameSender =
    previousMessage &&
    previousMessage.senderId === message.senderId &&
    differenceInMinutes(
      new Date(message.createdAt),
      new Date(previousMessage.createdAt)
    ) <= 10 &&
    !message.referencedMessage;

  const isPreviousMessageDifferentDay =
    previousMessage &&
    !isSameDay(
      new Date(message.createdAt),
      new Date(previousMessage.createdAt)
    );

  const isNextMessageSameSender =
    nextMessage &&
    nextMessage.senderId === message.senderId &&
    differenceInMinutes(
      new Date(nextMessage.createdAt),
      new Date(message.createdAt)
    ) <= 10 &&
    !nextMessage.referencedMessage;

  return (
    <>
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
            isPreviousMessageSameSender ? 'mb-0' : 'mb-2 py-2',
            isNextMessageSameSender ? 'mb-0 py-0' : 'mb-2',
            isCurrentReplyingToMessage && 'bg-[#393c48] hover:bg-[#35384a]',
            isFlashing && 'bg-[#393c48] hover:bg-[#35384a]'
          )}
        >
          <ReferencedMessage
            message={message}
            preview={preview}
            onReferencedMessageClicked={onReferencedMessageClicked}
          />

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
                  !preview && !isPreviousMessageSameSender && 'cursor-pointer'
                )}
              >
                {isPreviousMessageSameSender ? (
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
                  {!isPreviousMessageSameSender && (
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
                                yOffset={
                                  message.reactions.length > 0 ? 110 : 85
                                }
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
                <MessageAttachments
                  message={message}
                  preview={preview}
                  onDeleteAttachment={(attachment) => {
                    executeDeleteAttachment({
                      attachmentId: attachment.id,
                      channelId: message.channelId,
                      messageId: message.id,
                      serverId: message.sender.serverId,
                    });
                  }}
                  Wrapper={
                    <ChannelMessageContextMenu
                      member={member}
                      currentMember={currentMember}
                      message={message}
                      disabled={preview}
                      channel={channel}
                    />
                  }
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
                  <Trash2
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    onClick={(e) => {
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
                    }}
                  />
                </ActionTooltip>
              </div>
            )}
          </div>
        </div>
      </ChannelMessageContextMenu>
      {isPreviousMessageDifferentDay && (
        <div className="my-8 mx-4 border-zinc-600 border-b-[1px] h-3 flex align-center justify-center relative">
          <span className="px-2 py-1 text-xs bg-[#313338] flex items-center justify-center mt-[7px] text-zinc-400 font-semibold">
            {getDateAsString(
              new Date(message.createdAt),
              DateString.ddddMMYYYY
            )}
          </span>
        </div>
      )}
    </>
  );
};

export default ChannelMessage;
