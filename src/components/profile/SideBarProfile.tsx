'use client';

import { useActivity } from '@/hooks/useActivityStore';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';
import { ServerSocketEvents } from '../../../server/socket/server';
import { Activity, TActivity } from '../../../server/User';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { activityIndicatorMap } from '../UserAvatarWithActivity';

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

const SideBarProfile = () => {
  const users = useActivity((state) => state.users);
  const session = useSession();

  if (!session.data?.user) return null;

  return (
    <div>
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
    </div>
  );
};

export default SideBarProfile;
