'use client';
import { sendMessage } from '@/features/server/channel/send-message/send-message.action';
import {
  MAX_MESSAGE_LENGTH,
  sendMessageSchema,
  TSendMessage,
} from '@/features/server/channel/send-message/send-message.schema';
import { SocketEvents } from '@/lib/socketUtils';
import { cn } from '@/lib/utils';
import { socket } from '@/socket';
import { Channel, Member } from '@prisma/client';
import { Plus, Smile } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { FormEvent, useRef, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { modal } from '../Modal';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';

const ChatInput: React.FC<{ channel: Channel; currentMember: Member }> = ({
  channel,
  currentMember,
}) => {
  const [inputContent, setInputContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const form = useZodForm({
    schema: sendMessageSchema,
    defaultValues: {
      content: '',
      channelId: channel.id,
      memberId: currentMember.id,
    },
    mode: 'onSubmit',
  });

  const { execute, result: state } = useAction(sendMessage, {
    onSuccess: (message) => {
      socket.emit(SocketEvents.NEW_MESSAGE, {
        message: message.data,
        channelId: channel.id,
      });
      form.reset();
    },
  });

  const onError = (errors: FieldErrors<TSendMessage>) => {
    if (errors.content) {
      modal.error({
        title: 'Your message is too long',
        message: errors.content.message,
      });
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    form.setValue('content', content, { shouldValidate: true });
  };

  const content = form.watch('content');

  return (
    <Form {...form} state={state}>
      <form ref={formRef} onSubmit={form.handleSubmit(execute, onError)}>
        <div className="relative p-4 pb-6">
          <button
            type="button"
            className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors rounded-full p-1 flex items-center justify-center"
          >
            <Plus className="cursor-pointer text-white dark:text-[#313338]" />
          </button>
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormControl>
                  <div
                    contentEditable
                    className="rounded-md border-input px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-14 pr-28 py-4 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none overflow-hidden"
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all',
                    }}
                    onInput={handleInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(execute, onError)();
                      }
                    }}
                  ></div>
                  {/* <Textarea
                    onInput={(e) => {
                      e.currentTarget.style.height =
                        e.currentTarget.scrollHeight + 'px';
                    }}
                    className="pl-14 pr-28 py-3 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none overflow-y-hidden"
                    style={{
                      height: '44px',
                    }}
                    placeholder={`Envoyer un message dans #${channel.name}`}
                    {...field}
                  /> */}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="text-xs absolute top-[33px] right-16">
            <span
              className={cn(
                content.length > MAX_MESSAGE_LENGTH && 'text-red-500'
              )}
            >
              {content.length}
            </span>
            /2000
          </div>
          <div className="absolute top-7 right-8">
            <Smile className="cursor-pointer" />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
