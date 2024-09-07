'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { User } from '@prisma/client';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

type HomeUserWithActivityProps = {
  user: User;
};

const HomeUserWithActivity: React.FC<HomeUserWithActivityProps> = ({
  user,
}) => {
  const usersActivity = useActivity((state) => state.users);

  return (
    <>
      <UserAvatarWithActivity
        src={user.image}
        activity={usersActivity[user.id]}
        size={'sm'}
      />
      <div className="flex flex-col justify-center ml-2 max-w-[66%]">
        <p className="truncate text-sm font-semibold">
          {user.username || user.name}
        </p>
      </div>
    </>
  );
};

export default HomeUserWithActivity;
