'use client';
import { sendMessage } from '@/features/server/channel/message/send-message/send-message.action';
import {
  MAX_MESSAGE_LENGTH,
  sendMessageSchema,
  TSendMessage,
} from '@/features/server/channel/message/send-message/send-message.schema';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { cn } from '@/lib/utils';
import { spanToMention } from '@/lib/utils/message.utils';
import { socket } from '@/socket';
import { Channel, Member } from '@prisma/client';
import { CircleX, Pencil, Plus, Smile, Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getChannelSocketEvents } from '../../../server/socket/channel';
import { ServerSocketEvents } from '../../../server/socket/server';
import ChatInput from '../form/ChatInput';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';

const ChannelChatInput: React.FC<{
  channel: Channel;
  currentMember: Member;
  members: MemberWithUser[];
}> = ({ channel, currentMember, members }) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  const { replyingToMessage, setReplyingToMessage, editingMessageId } =
    useGlobalStore((state) => ({
      replyingToMessage: state.replyingToMessage,
      setReplyingToMessage: state.setReplyingToMessage,
      editingMessageId: state.editingMessageId,
    }));

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const form = useZodForm({
    schema: sendMessageSchema,
    defaultValues: {
      content: '',
      channelId: channel.id,
      memberId: currentMember.id,
    },
    mode: 'onSubmit',
  });

  const { executeAsync, result: state } = useAction(sendMessage, {
    onSuccess: (message) => {
      socket.emit(ServerSocketEvents.newMessage, {
        message: message.data,
        channelId: channel.id,
      });
      if (message.data?.mentions?.length ?? 0 > 0) {
        socket.emit(ServerSocketEvents.mention, {
          channelId: channel.id,
          mentions: message.data!.mentions,
        });
      }
      form.reset();
      inputRef.current!.innerHTML = '';
      setAttachments([]);
      setAttachmentPreviews([]);
    },
  });

  const handleSubmit = async (v: TSendMessage) => {
    const parsedContent = spanToMention(v.content);
    socket.emit(ServerSocketEvents.stopTyping, {
      channelId: channel.id,
      username: currentMember.username,
    });

    const formData = new FormData();
    for (const attachment of attachments) {
      formData.append('attachments', attachment);
    }

    await executeAsync({
      ...v,
      content: parsedContent,
      replyingToMessageId: replyingToMessage?.id,
      attachmentFormData: formData,
    });
    setReplyingToMessage(undefined);
    setAttachments([]);
  };

  const [isTyping, setIsTyping] = useState<string[]>([]);

  useEffect(() => {
    const channelSocketEvents = getChannelSocketEvents(channel.id);

    socket.on(channelSocketEvents.isTyping, (username) => {
      if (username === currentMember.username) return;
      setIsTyping((prev) => {
        if (prev.includes(username)) return prev;
        return [...prev, username];
      });
    });

    socket.on(channelSocketEvents.stopTyping, (username) => {
      setIsTyping((prev) => prev.filter((p) => p !== username));
    });

    return () => {
      socket.off(channelSocketEvents.isTyping);
      socket.off(channelSocketEvents.stopTyping);
    };
  }, [channel.id]);

  const content = form.watch('content');

  return (
    <Form {...form} state={state}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="relative p-4 pb-6">
          <div className="absolute w-[calc(100%-2rem)] bottom-20">
            <div
              className={cn(
                'hidden bg-[#2b2d31] rounded-t-md px-3 py-2 cursor-pointer select-none',
                replyingToMessage && 'flex items-center'
              )}
            >
              <span className="text-sm text-zinc-400">
                Replying to{' '}
                <span className="text-zinc-300 font-semibold">
                  {replyingToMessage?.sender.username}
                </span>
              </span>
              <CircleX
                className="ml-auto w-5 h-5 fill-zinc-400 hover:fill-zinc-200 text-[#2b2d31] transition-colors"
                onClick={() => {
                  setReplyingToMessage(undefined);
                }}
              />
            </div>
            <div
              className={cn(
                'hidden bg-zinc-700 px-3 py-2 select-none border-zinc-600 border-b-[1px] gap-6 overflow-x-auto',
                attachmentPreviews.length > 0 && 'flex items-center',
                replyingToMessage ? 'rounded-t-none' : 'rounded-t-md'
              )}
            >
              {attachmentPreviews.map((preview, i) => (
                <div key={i} className="relative">
                  <Image
                    src={preview}
                    width={200}
                    height={200}
                    className="rounded-md"
                    alt="Attachment preview"
                  />
                  <button
                    style={{
                      boxShadow: '0 0 5px #242628',
                    }}
                    className="absolute z-20 top-0 -right-4 bg-[#313338] border-[#303136] border-[1px] flex p-[1px] text-zinc-400 items-center gap-1 justify-center rounded-md"
                    onClick={() => {
                      setAttachmentPreviews((prev) =>
                        prev.filter((_, index) => index !== i)
                      );
                      setAttachments((prev) =>
                        prev.filter((_, index) => index !== i)
                      );
                    }}
                  >
                    <div className="group p-1 rounded-md hover:bg-zinc-700 transition-colors">
                      <Pencil className="w-4 h-4 fill-zinc-400 group-hover:fill-zinc-200 group-hover:text-zinc-200 transition-colors" />
                    </div>
                    <div className="group p-1 rounded-md hover:bg-zinc-700 transition-colors">
                      <Trash2 className="w-4 h-4 text-[#da373c]/70 hover:text-[#da373c]/90 transition-colors" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={cn(
              'absolute left-8 h-[24px] w-[24px] top-[30px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors rounded-full p-1 flex items-center justify-center'
            )}
          >
            <Plus className="cursor-pointer text-white dark:text-[#313338]" />
          </button>
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormControl>
                  <ChatInput
                    inputRef={inputRef}
                    xOffset={2}
                    inputClassName={cn(
                      'pl-14',
                      replyingToMessage || attachmentPreviews.length > 0
                        ? 'rounded-b-md'
                        : 'rounded-md'
                    )}
                    members={members}
                    onInput={(content) => {
                      if (content.length === 1) {
                        socket.emit(ServerSocketEvents.isTyping, {
                          channelId: channel.id,
                          username: currentMember.username,
                        });
                      } else if (content.length === 0) {
                        socket.emit(ServerSocketEvents.stopTyping, {
                          channelId: channel.id,
                          username: currentMember.username,
                        });
                      }
                      form.setValue('content', content, {
                        shouldValidate: false,
                      });
                    }}
                    onBlur={() => {
                      setIsTyping((prev) =>
                        prev.filter((p) => p !== currentMember.username)
                      );
                    }}
                    onSubmit={() => {
                      form.handleSubmit(handleSubmit)();
                    }}
                    onImagePaste={(file) => {
                      setAttachments((prev) => [...prev, file]);
                      const reader = new FileReader();

                      reader.onload = (e) => {
                        const imageSrc = e.target?.result as string;
                        if (imageSrc) {
                          setAttachmentPreviews((prev) => [...prev, imageSrc]);
                        }
                      };

                      reader.readAsDataURL(file);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            className={cn(
              'absolute right-8 flex items-center gap-2 top-[30px]'
            )}
          >
            <div className="text-xs">
              <span
                className={cn(
                  content.length > MAX_MESSAGE_LENGTH && 'text-red-500'
                )}
              >
                {content.length}
              </span>
              /2000
            </div>
            <Smile className="cursor-pointer" />
          </div>
          <div className="h-1">
            {isTyping.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {isTyping.join(', ')} is typing...
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChannelChatInput;
