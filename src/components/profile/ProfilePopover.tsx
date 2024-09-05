import { cn } from '@/lib/utils';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import ProfileCard from './ProfileCard';

type TProfilePopoverProps = {
  member: MemberWithUser;
  asChild?: boolean;
  popoverContentProps?: ComponentProps<typeof PopoverContent>;
  disabled?: boolean;
  triggerProps?: Omit<ComponentProps<typeof PopoverTrigger>, 'asChild'>;
};

const ProfilePopover: React.FC<
  TProfilePopoverProps & PropsWithChildren & ComponentProps<typeof Popover>
> = ({
  member,
  children,
  asChild = true,
  popoverContentProps,
  disabled,
  triggerProps,
  ...rest
}) => {
  return (
    <Popover {...rest}>
      <PopoverTrigger asChild={asChild} {...triggerProps}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="right"
        {...popoverContentProps}
        className={cn(popoverContentProps?.className, disabled && 'hidden')}
      >
        <ProfileCard member={member} />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
