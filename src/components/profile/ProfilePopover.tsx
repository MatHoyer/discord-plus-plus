import { cn } from '@/lib/utils';
import { User, UserGuildProfile } from '@prisma/client';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import ProfileCard from './ProfileCard';

type TProfilePopoverProps = {
  user: User;
  member?: UserGuildProfile;
  asChild?: boolean;
  popoverContentProps?: ComponentProps<typeof PopoverContent>;
  disabled?: boolean;
  triggerProps?: Omit<ComponentProps<typeof PopoverTrigger>, 'asChild'>;
  isSideBar?: boolean;
};

const ProfilePopover: React.FC<
  TProfilePopoverProps & PropsWithChildren & ComponentProps<typeof Popover>
> = ({
  user,
  member,
  children,
  asChild = true,
  popoverContentProps,
  disabled,
  triggerProps,
  isSideBar = false,
  ...rest
}) => {
  return (
    <Popover {...rest}>
      <PopoverTrigger asChild={asChild} {...triggerProps}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={isSideBar ? 'top' : 'right'}
        {...popoverContentProps}
        className={cn(
          popoverContentProps?.className,
          disabled && 'hidden',
          isSideBar && 'translate-x-6',
          'p-0 rounded-md'
        )}
      >
        <ProfileCard user={user} member={member} isSideBar={isSideBar} />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
