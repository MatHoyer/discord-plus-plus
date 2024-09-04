'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type TChannelMentionSuggestionsProps = {
  members: MemberWithUser[];
  onSelect: (member: MemberWithUser) => void;
  open: boolean;
  offset?: number;
};

const ChannelMentionSuggestions: React.FC<TChannelMentionSuggestionsProps> = ({
  members,
  onSelect,
  open,
  offset = 2,
}) => {
  const usersActivity = useActivity((state) => state.users);
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
        if (member) {
          onSelect(member);
        }
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
        'absolute  z-20 border-white border-opacity-10 border text-black bg-[#2b2d31] rounded-md hidden px-2 py-2',
        open && members.length > 0 && 'block'
      )}
      style={{
        width: `calc(100% - ${offset}rem)`,
        bottom: '85px',
      }}
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
            <UserAvatarWithActivity
              src={member.user.image}
              size="xs"
              activityIndicator={{
                size: 'xs',
              }}
              activity={usersActivity[member.user.id]}
            />
            <span className="text-white text-sm">{member.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelMentionSuggestions;
