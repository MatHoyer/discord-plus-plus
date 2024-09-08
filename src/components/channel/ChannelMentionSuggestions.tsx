'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type TChannelMentionSuggestionsProps = {
  members: MemberWithUser[];
  onSelect: (member: MemberWithUser) => void;
  open: boolean;
  xOffset?: number;
  yOffset?: number;
};

const ChannelMentionSuggestions: React.FC<TChannelMentionSuggestionsProps> = ({
  members,
  onSelect,
  open,
  xOffset = 2,
  yOffset = 85,
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
        if (member && open) {
          onSelect(member);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [members, onSelect, selectedSuggestion, open]);

  return (
    <div
      className={cn(
        'absolute  z-20 border-white border-opacity-10 border text-black bg-[#2b2d31] rounded-md hidden px-2 py-2',
        open && members.length > 0 && 'block'
      )}
      style={{
        width: `calc(100% - ${xOffset}rem)`,
        bottom: `${yOffset}px`,
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
            <span className="text-white text-sm">{member.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelMentionSuggestions;
