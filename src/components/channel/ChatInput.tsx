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
import { Channel } from '@prisma/client';
import { Plus, Smile } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { modal } from '../Modal';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';
import { Input } from '../ui/input';

const ChatInput: React.FC<{ channel: Channel }> = ({ channel }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useZodForm({
    schema: sendMessageSchema,
    defaultValues: {
      content: '',
      channelId: channel.id,
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

  const content = form.watch('content');

  return (
    <Form {...form} state={state}>
      <form ref={formRef} onSubmit={form.handleSubmit(execute, onError)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors rounded-full p-1 flex items-center justify-center">
                    <Plus className="cursor-pointer text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    className="pl-14 pr-32 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Envoyer un message dans #${channel.name}`}
                    {...field}
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
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
