import { useActivity } from '@/hooks/useActivityStore';
import { socket } from '@/socket';
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
      <div>{Activity[activity]}</div>
    </div>
  );
};

type TSelectActivityProps = {
  member: MemberWithUser;
};

const SelectActivity: React.FC<TSelectActivityProps> = ({ member }) => {
  const users = useActivity((state) => state.users);

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex justify-start ">
          <ActivityState activity={users[member.user.id] || Activity.Online} />
          <ChevronRight />
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
