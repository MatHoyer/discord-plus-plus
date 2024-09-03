'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';

type TChannelMentionSuggestionsProps = {
  members: MemberWithUser[];
  onSelect: (member: MemberWithUser) => void;
  className?: string;
  open: boolean;
};

const ChannelMentionSuggestions: React.FC<TChannelMentionSuggestionsProps> = ({
  members,
  onSelect,
  className,
  open,
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(
    members[0]?.id || null
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (members.length === 0) return;

      const currentIndex = members.findIndex(
        (member) => member.id === selectedSuggestion
      );

      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % members.length;
        setSelectedSuggestion(members[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + members.length) % members.length;
        setSelectedSuggestion(members[prevIndex].id);
      } else if (e.key === 'Enter') {
        const member = members[currentIndex];
        onSelect(member);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [members, onSelect, selectedSuggestion]);

  return (
    <div
      className={cn(
        'absolute bottom-20 z-20 border-white border-opacity-10 border text-black bg-[#2b2d31] rounded-md hidden w-[calc(100%-2rem)] px-2 py-2',
        open && members.length > 0 && 'block'
      )}
    >
      <div className="text-white font-semibold text-xs mb-2 ">MEMBERS</div>
      <div className="space-y-1">
        {members.map((member) => (
          <div
            key={member.id}
            onMouseEnter={() => setSelectedSuggestion(member.id)}
            onMouseLeave={() => setSelectedSuggestion(null)}
            onClick={(e) => {
              e.preventDefault();
              onSelect(member);
            }}
            className={cn(
              'p-1 rounded-md flex items-center gap-x-2 cursor-pointer',
              selectedSuggestion === member.id && 'bg-[#35373c]'
            )}
          >
            <UserAvatar src={member.user.image} className="md:w-6 md:h-6" />
            <span className="text-white text-sm">{member.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelMentionSuggestions;
