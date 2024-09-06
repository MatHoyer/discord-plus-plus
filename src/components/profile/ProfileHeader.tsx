'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Activity, TActivity } from '../../../server/User';
import { ServerSocketEvents } from '../../../server/socket/server';
import UserAvatarWithActivity, {
  activityIndicatorMap,
} from '../UserAvatarWithActivity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const handleActivityChange = (activity: TActivity) => {
  socket.emit(ServerSocketEvents.changeActivity, { activity });
};

const ActivityState: React.FC<{ activity: TActivity }> = ({ activity }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer w-full h-full">
      <div className="h-4">{activityIndicatorMap[activity]}</div>
      <div>{Activity[activity]}</div>
    </div>
  );
};

const SelectActivity: React.FC = ({}) => {
  const users = useActivity((state) => state.users);
  const session = useSession();

  if (!session.data?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ActivityState
          activity={users[session.data.user.id] || Activity.Online}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(Activity).map((key) => {
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleActivityChange(key as TActivity)}
            >
              <ActivityState activity={key as TActivity} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ProfileHeader: React.FC<{
  member: MemberWithUser;
  shouldHaveSettings?: boolean;
}> = ({ member, shouldHaveSettings = false }) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <>
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
            activity={usersActivity[member.userId] ?? 'Offline'}
            src={member.user?.image}
            activityIndicator={{
              size: 'xl',
            }}
          />
        </div>
      </div>
      <div className="min-h-[100px] pt-12 px-4">
        <div className="flex flex-col">
          <div className="font-bold">{member.username}</div>
          <span className="text-xs">{member.user.name}</span>
        </div>
        <div className="py-2 px-2 mt-4 border border-[#353c47] rounded-md bg-[#232528]">
          <div>
            <div className="text-xs">Member Since</div>
            <div className="text-xs flex items-center gap-1">
              {getCustomDate(new Date(member.user.createdAt))}
              <div className="w-1 h-1 bg-white rounded-full" />
              {getCustomDate(new Date(member.createdAt))}
            </div>
          </div>
        </div>
      </div>
      {shouldHaveSettings && <SelectActivity />}
    </>
  );
};

export default ProfileHeader;
