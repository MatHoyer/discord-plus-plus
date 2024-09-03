import React, { ComponentProps, PropsWithChildren } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import ProfileCard from './ProfileCard';

type TProfilePopoverProps = {
  member: MemberWithUser;
  asChild?: boolean;
  popoverContentProps?: ComponentProps<typeof PopoverContent>;
};

const ProfilePopover: React.FC<
  TProfilePopoverProps & PropsWithChildren & ComponentProps<typeof Popover>
> = ({ member, children, asChild = true, popoverContentProps, ...rest }) => {
  return (
    <Popover {...rest}>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent side="right" {...popoverContentProps}>
        <ProfileCard member={member} />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
