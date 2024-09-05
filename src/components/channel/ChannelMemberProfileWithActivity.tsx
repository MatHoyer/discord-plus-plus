'user client';
import { useActivity } from '@/hooks/useActivityStore';
import ProfileContextMenu from '../context-menus/ProfileContextMenu';
import ProfilePopover from '../profile/ProfilePopover';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

const ChannelMemberProfileWithActivity: React.FC<{
  member: MemberWithUser;
}> = ({ member }) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <ProfileContextMenu member={member}>
      <ProfilePopover key={member.id} member={member}>
        <div className="flex items-center p-2 cursor-pointer rounded-md hover:bg-[#35373c] transition-colors">
          <UserAvatarWithActivity
            src={member.user.image}
            activity={usersActivity[member.user.id]}
          />
          <p className="ml-2 truncate">{member.username}</p>
        </div>
      </ProfilePopover>
    </ProfileContextMenu>
  );
};

export default ChannelMemberProfileWithActivity;
