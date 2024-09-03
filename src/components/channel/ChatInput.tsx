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
import { useRef, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { modal } from '../Modal';
import { Form, FormControl, FormField, FormItem, useZodForm } from '../ui/form';
import ChannelMentionSuggestions from './ChannelMentionSuggestions';

const ChatInput: React.FC<{
  channel: Channel;
  currentMember: Member;
  members: MemberWithUser[];
}> = ({ channel, currentMember, members }) => {
  const [filteredMembers, setFilteredMembers] = useState<
    MemberWithUser[] | null
  >(members);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [atSymbolPosition, setAtSymbolPosition] = useState<number | null>(null);
  const [isMentionPopoverOpen, setIsMentionPopoverOpen] = useState(false);

  const wholeInputRef = useRef<HTMLDivElement>(null);
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
      setIsMentionPopoverOpen(false);
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

  const handleMentionSelect = (member: MemberWithUser) => {
    if (!editableDivRef.current || !savedRange) return;

    editableDivRef.current.focus();
    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(savedRange);

    const range = selection.getRangeAt(0);

    if (!range || atSymbolPosition === null) return;

    range.setStart(range.startContainer, atSymbolPosition);
    range.setEnd(range.startContainer, range.endOffset);
    range.deleteContents();

    const mentionSpan = document.createElement('span');
    mentionSpan.textContent = `@${member.username}`;
    mentionSpan.className =
      'text-white px-2 py-1 bg-[#32355c] bg-opacity-70 font-semibold rounded-md';
    mentionSpan.dataset.userId = member.id.toString();
    mentionSpan.contentEditable = 'false';

    range.deleteContents();
    range.insertNode(mentionSpan);

    range.setStartAfter(mentionSpan);
    range.setEndAfter(mentionSpan);

    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
    setIsMentionPopoverOpen(false);
    setAtSymbolPosition(null);
  };

  const handleInput = () => {
    if (editableDivRef.current) {
      const content = editableDivRef.current.innerHTML;
      form.setValue('content', content, { shouldValidate: true });

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textBeforeCursor = range.startContainer.textContent?.substring(
          0,
          range.startOffset
        );

        const atIndex = textBeforeCursor?.lastIndexOf('@');
        if (atIndex !== undefined && atIndex !== -1) {
          setAtSymbolPosition(atIndex);
          setFilteredMembers(members);
          setSavedRange(range.cloneRange());
          const query = textBeforeCursor?.substring(atIndex + 1);
          setIsMentionPopoverOpen(true);
          filterMembers(query || '');
        } else {
          setAtSymbolPosition(null);
          setIsMentionPopoverOpen(false);
        }
      }
    }
  };

  const filterMembers = (query: string) => {
    setFilteredMembers(
      members.filter((member) =>
        member.username.toLowerCase().startsWith(query.toLowerCase())
      )
    );
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
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit, onError)}>
        <div className="relative p-4 pb-6" ref={wholeInputRef}>
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
                  <div>
                    <ChannelMentionSuggestions
                      members={filteredMembers || []}
                      onSelect={handleMentionSelect}
                      open={isMentionPopoverOpen}
                    />
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
                        if (
                          (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
                          isMentionPopoverOpen
                        ) {
                          e.preventDefault();
                        }
                        if (e.key === '@') {
                          setIsMentionPopoverOpen(true);
                          setTimeout(() => {
                            editableDivRef.current?.focus();
                          }, 100);
                        }
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (
                            !isMentionPopoverOpen ||
                            !filteredMembers?.length
                          ) {
                            form.handleSubmit(handleSubmit, onError)();
                          }
                        }
                      }}
                    />
                  </div>
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
