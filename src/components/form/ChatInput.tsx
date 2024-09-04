'use client';
import { cn } from '@/lib/utils';
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
  offset?: number;
};

const ChatInput: React.FC<TChatInputProps> = ({
  onInput,
  onBlur,
  onSubmit,
  members,
  inputClassName,
  value,
  inputRef: editableDivRef,
  offset,
}) => {
  const [filteredMembers, setFilteredMembers] = useState<
    MemberWithUser[] | null
  >(members);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [atSymbolPosition, setAtSymbolPosition] = useState<number | null>(null);
  const [isMentionPopoverOpen, setIsMentionPopoverOpen] = useState(false);

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

  useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.innerHTML = value || '';
    }
  }, []);

  return (
    <div>
      <ChannelMentionSuggestions
        members={filteredMembers || []}
        onSelect={handleMentionSelect}
        open={isMentionPopoverOpen}
        offset={offset}
      />
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
          'rounded-md border-input px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-28 py-4 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none overflow-hidden',
          inputClassName
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
          }
        }}
        onBlur={
          onBlur
            ? () => onBlur(editableDivRef.current?.innerHTML || '')
            : undefined
        }
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
