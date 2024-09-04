'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { ScrollArea } from '../ui/scroll-area';
import ChannelMemberProfileWithActivity from './ChannelMemberProfileWithActivity';

const ChannelMembersCategory: React.FC<{
  title: string;
  members: MemberWithUser[];
}> = ({ title, members }) =>
  members.length > 0 ? (
    <>
      <div className="text-[#8e9ba4] text-sm font-semibold">
        {title} - {members.length}
      </div>
      {members.map((member) => (
        <ChannelMemberProfileWithActivity member={member} />
      ))}
    </>
  ) : null;

const ChannelMembers: React.FC<{ members: MemberWithUser[] }> = ({
  members,
}) => {
  const usersActivity = useActivity((state) => state.users);

  const onlineUsers = members.filter(
    (member) => (usersActivity[member.user.id] || 'Offline') !== 'Offline'
  );
  const offlineUsers = members.filter(
    (member) => (usersActivity[member.user.id] || 'Offline') === 'Offline'
  );

  return (
    <ScrollArea className="px-3 py-2">
      <ChannelMembersCategory title="Online" members={onlineUsers} />
      <ChannelMembersCategory title="Offline" members={offlineUsers} />
    </ScrollArea>
  );
};

export default ChannelMembers;
