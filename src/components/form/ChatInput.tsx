'use client';
import { useEventListener } from '@/hooks/useEventListener';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { cn } from '@/lib/utils';
import { mentionClassName } from '@/lib/utils/message.utils';
import { CircleX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ChannelMentionSuggestions from '../channel/ChannelMentionSuggestions';

type TChatInputProps = {
  inputRef: React.RefObject<HTMLDivElement>;
  members: MemberWithUser[];
  onInput?: (content: string) => void;
  onBlur?: (content: string) => void;
  onSubmit?: () => void;
  inputClassName?: string;
  value?: string;
  xOffset?: number;
  yOffset?: number;
};

const ChatInput: React.FC<TChatInputProps> = ({
  onInput,
  onBlur,
  onSubmit,
  members,
  inputClassName,
  value,
  inputRef: editableDivRef,
  xOffset,
  yOffset,
}) => {
  const {
    replyingToMessage,
    setReplyingToMessage,
    editingMessageId,
    currentMentionnedMember,
    removeCurrentMemberMention,
  } = useGlobalStore((state) => ({
    replyingToMessage: state.replyingToMessage,
    setReplyingToMessage: state.setReplyingToMessage,
    editingMessageId: state.editingMessageId,
    currentMentionnedMember: state.currentMentionnedMember,
    removeCurrentMemberMention: state.removeCurrentMemberMention,
  }));
  const [filteredMembers, setFilteredMembers] = useState<
    MemberWithUser[] | null
  >(members);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [atSymbolPosition, setAtSymbolPosition] = useState<number | null>(null);
  const [isMentionPopoverOpen, setIsMentionPopoverOpen] = useState(false);

  const addMemberMention = (member: MemberWithUser, range: Range) => {
    const mentionSpan = document.createElement('span');
    mentionSpan.textContent = `@${member.username}`;
    mentionSpan.className = mentionClassName;
    mentionSpan.dataset.userId = member.id.toString();
    mentionSpan.contentEditable = 'false';

    range.deleteContents();
    range.insertNode(mentionSpan);

    range.setStartAfter(mentionSpan);
    range.setEndAfter(mentionSpan);

    return range;
  };

  const handleMentionSelect = (member: MemberWithUser) => {
    if (!editableDivRef.current) return;
    if (document.activeElement !== editableDivRef.current) {
      focusInputWithTimeout(10);
    }
    setTimeout(() => {
      const selection = window.getSelection();

      if (!selection) return;

      if (savedRange) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }

      const range = selection.getRangeAt(0);
      if (!range) return;

      range.setStart(
        range.startContainer,
        atSymbolPosition ?? range.startOffset
      );
      range.setEnd(range.startContainer, range.endOffset);
      range.deleteContents();

      selection.removeAllRanges();
      selection.addRange(addMemberMention(member, range));

      handleInput();
      setIsMentionPopoverOpen(false);
      setAtSymbolPosition(null);
    }, 100);
  };

  const handleInput = () => {
    if (editableDivRef.current) {
      const content = editableDivRef.current.innerHTML;
      onInput?.(content);

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

  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    selection.deleteFromDocument();

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
  };

  const filterMembers = (query: string) => {
    setFilteredMembers(
      members.filter((member) =>
        member.username.toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };

  const focusInput = () => {
    editableDivRef.current?.focus();
  };

  const focusInputWithTimeout = (ms: number = 100) => {
    setTimeout(() => {
      focusInput();
    }, ms);
  };

  useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.innerHTML = value || '';
      focusInputWithTimeout(100);
      handleInput();
    }
  }, []);

  useEffect(() => {
    if (replyingToMessage) {
      focusInputWithTimeout();
    }
  }, [replyingToMessage]);

  useEffect(() => {
    if (currentMentionnedMember) {
      handleMentionSelect(currentMentionnedMember);
      removeCurrentMemberMention();
    }
  }, [currentMentionnedMember]);

  useEventListener(
    'keydown',
    () => {
      if (
        !editingMessageId &&
        document.activeElement !== editableDivRef.current
      ) {
        focusInput();
      }
    },
    [editingMessageId]
  );

  useEventListener(
    'keyup',
    (e) => {
      if (e.key === 'Escape') {
        if (isMentionPopoverOpen) setIsMentionPopoverOpen(false);
        if (!!replyingToMessage) setReplyingToMessage(undefined);
      }
    },
    [isMentionPopoverOpen, replyingToMessage]
  );

  return (
    <div className="relative">
      <ChannelMentionSuggestions
        members={filteredMembers || []}
        onSelect={handleMentionSelect}
        open={isMentionPopoverOpen}
        xOffset={xOffset}
        yOffset={yOffset}
      />
      <div
        className={cn(
          'hidden bg-[#2b2d31] rounded-t-md px-3 py-2 cursor-pointer select-none',
          replyingToMessage && !editingMessageId && 'flex items-center'
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
        ref={editableDivRef}
        onPaste={(e) => {
          e.preventDefault();
          const clipboardData =
            e.clipboardData || (window as any).clipboardData;
          const text = clipboardData.getData('text/plain');
          insertTextAtCursor(text);
        }}
        contentEditable
        className={cn(
          'empty:before:content-["Type_here..."] empty:before:text-zinc-500 border-input px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-28 py-4 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none overflow-hidden',
          inputClassName,
          !replyingToMessage ? 'rounded-md' : 'rounded-b-md'
        )}
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-all',
        }}
        onInput={handleInput}
        onFocus={() => {
          if (editableDivRef.current) {
            const range = document.createRange();
            range.selectNodeContents(editableDivRef.current);
            range.collapse(false);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            }
            handleInput();
          }
        }}
        onBlur={() => {
          setIsMentionPopoverOpen(false);
          onBlur?.(editableDivRef.current?.innerHTML || '');
        }}
        onKeyDown={(e) => {
          if (
            (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
            isMentionPopoverOpen
          ) {
            e.preventDefault();
          }
          if (e.key === '@') {
            setIsMentionPopoverOpen(true);
            focusInputWithTimeout();
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!isMentionPopoverOpen || !filteredMembers?.length) {
              onSubmit?.();
            }
          }
        }}
      />
    </div>
  );
};

export default ChatInput;
