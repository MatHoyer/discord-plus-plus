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
import { Plus, Smile } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
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
    },
  });

  const handleSubmit = async (v: TSendMessage) => {
    const parsedContent = spanToMention(v.content);
    socket.emit(ServerSocketEvents.stopTyping, {
      channelId: channel.id,
      username: currentMember.username,
    });
    await executeAsync({
      ...v,
      content: parsedContent,
      replyingToMessageId: replyingToMessage?.id,
    });
    setReplyingToMessage(undefined);
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
          <button
            type="button"
            className={cn(
              'absolute left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors rounded-full p-1 flex items-center justify-center',
              replyingToMessage && !editingMessageId
                ? 'top-[66px]'
                : 'top-[30px]'
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
                    inputClassName=" pl-14"
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
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            className={cn(
              'absolute right-8 flex items-center gap-2',
              replyingToMessage && !editingMessageId
                ? 'top-[66px]'
                : 'top-[30px]'
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
