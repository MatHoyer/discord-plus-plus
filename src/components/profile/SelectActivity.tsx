import { useActivity } from '@/hooks/useActivityStore';
import { socket } from '@/socket';
import { User } from '@prisma/client';
import { ChevronRight } from 'lucide-react';
import { Activity, TActivity } from '../../../server/User';
import { ServerSocketEvents } from '../../../server/socket/server';
import { activityIndicatorMap } from '../UserAvatarWithActivity';
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
    <div className="flex items-center gap-2 w-full h-full">
      <div className="h-4 w-4">{activityIndicatorMap[activity]}</div>
      <div className="text-sm text-[#b0b4bb]">{Activity[activity]}</div>
    </div>
  );
};

type TSelectActivityProps = {
  user: User;
};

const SelectActivity: React.FC<TSelectActivityProps> = ({ user }) => {
  const users = useActivity((state) => state.users);

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex justify-start items-center">
          <ActivityState activity={users[user.id] || Activity.Online} />
          <ChevronRight className="text-[#b0b4bb] h-4 w-4" />
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

export default SelectActivity;
