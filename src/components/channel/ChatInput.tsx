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
import { useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { modal } from '../Modal';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';

const ChatInput: React.FC<{ channel: Channel; currentMember: Member }> = ({
  channel,
  currentMember,
}) => {
  const editableDivRef = useRef<HTMLDivElement>(null);

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
      editableDivRef.current!.innerHTML = '';
    },
  });

  const onError = async (errors: FieldErrors<TSendMessage>) => {
    if (errors.content) {
      await modal.error({
        title: 'Your message is too long',
        message: errors.content.message,
      });
      setTimeout(() => {
        editableDivRef.current?.focus();
      }, 100);
    }
  };

  const handleMentionSelect = () => {
    const selection = window.getSelection();

    if (!selection || !editableDivRef.current) return;

    const range = selection.getRangeAt(0);

    const isWithinEditableDiv = editableDivRef.current.contains(
      range.commonAncestorContainer
    );

    if (!isWithinEditableDiv) return;

    const mentionSpan = document.createElement('span');
    mentionSpan.textContent = '@OtpExhaustv2';
    mentionSpan.className =
      'text-white px-2 py-1 bg-[#32355c] bg-opacity-70 font-semibold rounded-md';
    mentionSpan.dataset.userId = '1';
    mentionSpan.contentEditable = 'false';

    range.deleteContents();
    range.insertNode(mentionSpan);

    range.setStartAfter(mentionSpan);
    range.setEndAfter(mentionSpan);

    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
  };

  const handleInput = () => {
    if (editableDivRef.current) {
      const content = editableDivRef.current.innerHTML;
      form.setValue('content', content, { shouldValidate: true });
    }
  };

  const handleSubmit = (v: TSendMessage) => {
    const parsedContent = v.content.replace(
      /<span[^>]*data-user-id="(\w+)"[^>]*>@[^<]+<\/span>/g,
      '<@$1>'
    );
    execute({ ...v, content: parsedContent });
  };

  const content = form.watch('content');

  return (
    <Form {...form} state={state}>
      <Button
        onClick={() => {
          handleMentionSelect();
        }}
      >
        coucou
      </Button>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit, onError)}>
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
                    ref={editableDivRef}
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
                        form.handleSubmit(handleSubmit, onError)();
                      }
                    }}
                  />
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
