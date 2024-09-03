'use client';
import { useActivity } from '@/hooks/useActivityStore';
import ProfilePopover from '../profile/ProfilePopover';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

const ChannelMembers: React.FC<{ members: MemberWithUser[] }> = ({
  members,
}) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <>
      {members.map((member) => (
        <ProfilePopover key={member.id} member={member}>
          <div className="flex items-center p-2">
            <UserAvatarWithActivity
              src={member.user.image}
              activity={usersActivity[member.user.id]}
            />
            <p className="ml-2">{member.username}</p>
          </div>
        </ProfilePopover>
      ))}
    </>
  );
};

export default ChannelMembers;
