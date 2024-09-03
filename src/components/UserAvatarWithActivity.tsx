import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CircleDot, CircleMinus, Moon } from 'lucide-react';
import React from 'react';
import { Activity } from '../../server/User';
import UserAvatar from './UserAvatar';

type TUserAvatarWithActivityProps = {
  wrapperClassName?: string;
  avatarClassName?: string;
  src?: string | null;
};

const avatarVariants = cva('md:w-20 md:h-20', {
  variants: {
    size: {
      default: 'h-7 w-7 md:h-10 md:w-10',
      xl: 'h-12 w-12 md:w-20 md:h-20',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const activityIndicatorVariants = cva(
  'absolute rounded-full bg-[#12202a] right-0',
  {
    variants: {
      size: {
        default: 'w-4 h-4 -bottom-1 p-[1.5px]',
        xl: 'w-7 h-7 bottom-0 p-1',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const activityIndicatorMap: Record<Activity, React.ReactNode> = {
  '0': <div className="rounded-full bg-green-500 w-full h-full" />,
  '1': (
    <Moon className="-rotate-90 h-full w-full text-yellow-500 fill-yellow-500" />
  ),
  '2': <CircleMinus className="h-full w-full fill-red-500 text-[#12202a]" />,
  '3': <CircleDot className="h-full w-full text-[#80848e]" />,
};

const UserAvatarWithActivity: React.FC<
  TUserAvatarWithActivityProps &
    VariantProps<typeof avatarVariants> & {
      activityIndicator?: VariantProps<typeof activityIndicatorVariants>;
      activity?: Activity;
    }
> = ({
  wrapperClassName,
  avatarClassName,
  src,
  size,
  activity = Activity.Online,
  activityIndicator,
}) => {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <UserAvatar
        src={src}
        className={cn(avatarVariants({ className: avatarClassName, size }))}
      />
      <div
        className={cn(
          activityIndicatorVariants({
            size: activityIndicator?.size,
          })
        )}
      >
        {activityIndicatorMap[activity]}
      </div>
    </div>
  );
};

export default UserAvatarWithActivity;
