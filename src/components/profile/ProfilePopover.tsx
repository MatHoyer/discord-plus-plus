import React, { ComponentProps, PropsWithChildren } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import ProfileCard from './ProfileCard';

type TProfilePopoverProps = {
  member: MemberWithUser;
  asChild?: boolean;
};

const ProfilePopover: React.FC<
  TProfilePopoverProps &
    PropsWithChildren &
    ComponentProps<typeof PopoverContent>
> = ({ member, children, asChild = true, ...rest }) => {
  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent side="right" {...rest}>
        <ProfileCard member={member} />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
