'user client';
import { useActivity } from '@/hooks/useActivityStore';
import { PropsWithChildren } from 'react';
import ProfileContextMenu from '../context-menus/ProfileContextMenu';
import ProfilePopover from '../profile/ProfilePopover';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type TChannelMemberProfileWithActivityProps = {
  member: MemberWithUser;
  isSideBar?: boolean;
} & PropsWithChildren;

const ChannelMemberProfileWithActivity: React.FC<
  TChannelMemberProfileWithActivityProps
> = ({ member, isSideBar = false, children }) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <ProfileContextMenu member={member}>
      <ProfilePopover key={member.id} member={member} isSideBar={isSideBar}>
        <div className="flex items-center p-2 cursor-pointer rounded-md hover:bg-[#35373c] transition-colors">
          <UserAvatarWithActivity
            src={member.user.image}
            activity={usersActivity[member.user.id]}
            size={'sm'}
          />
          <div className="flex flex-col justify-center ml-2 max-w-[66%]">
            <p className="truncate text-sm font-semibold">{member.username}</p>
            {children}
          </div>
        </div>
      </ProfilePopover>
    </ProfileContextMenu>
  );
};

export default ChannelMemberProfileWithActivity;
