'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { getCustomDate } from '@/lib/utils';
import { Member, User } from '@prisma/client';
import Image from 'next/image';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type TProfileHeaderProps = {
  user: User;
  member?: Member;
};

const ProfileHeader: React.FC<TProfileHeaderProps> = ({ user, member }) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <div className="mb-4">
      <div className="relative w-full h-36 rounded-lg">
        <Image
          src="https://wallpapers.com/images/featured/beautiful-background-td7gsxerv3ecl20h.jpg"
          width="1000"
          height="1000"
          alt="Background"
          className="w-full h-full object-cover filter absolute rounded-t-md"
        />
        <div className="absolute flex items-end justify-between h-full p-4">
          <UserAvatarWithActivity
            size="xl"
            wrapperClassName="absolute -bottom-9 z-10"
            avatarClassName='className="md:w-20 md:h-20'
            activity={usersActivity[user.id] ?? 'Offline'}
            src={user.image}
            activityIndicator={{
              size: 'xl',
            }}
          />
        </div>
      </div>
      <div className="min-h-[100px] pt-12 px-4">
        <div className="flex flex-col">
          <div className="font-bold">{member?.username || user.username}</div>
          <span className="text-xs">{user.name}</span>
        </div>
        <div className="py-2 px-2 mt-4 border border-[#353c47] rounded-md bg-[#232528]">
          <div>
            <div className="text-xs">Member Since</div>
            <div className="text-xs flex items-center gap-1">
              {getCustomDate(new Date(user.createdAt))}
              {!!member && (
                <>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  {getCustomDate(new Date(member.createdAt))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
