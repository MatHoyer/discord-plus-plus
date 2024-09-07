'user client';
import { useActivity } from '@/hooks/useActivityStore';
import { Member, User } from '@prisma/client';
import { PropsWithChildren } from 'react';
import ProfileContextMenu from '../context-menus/ProfileContextMenu';
import ProfilePopover from '../profile/ProfilePopover';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type TChannelMemberProfileWithActivityProps = {
  user: User;
  member?: Member;
  isSideBar?: boolean;
} & PropsWithChildren;

const ChannelMemberProfileWithActivity: React.FC<
  TChannelMemberProfileWithActivityProps
> = ({ user, member, isSideBar = false, children }) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <ProfileContextMenu user={user} member={member}>
      <ProfilePopover user={user} member={member} isSideBar={isSideBar}>
        <div className="flex items-center p-2 cursor-pointer rounded-md hover:bg-[#35373c] transition-colors">
          <UserAvatarWithActivity
            src={user.image}
            activity={usersActivity[user.id]}
            size={'sm'}
          />
          <div className="flex flex-col justify-center ml-2 max-w-[66%]">
            <p className="truncate text-sm font-semibold">
              {member?.username || user.username || user.name}
            </p>
            {children}
          </div>
        </div>
      </ProfilePopover>
    </ProfileContextMenu>
  );
};

export default ChannelMemberProfileWithActivity;
