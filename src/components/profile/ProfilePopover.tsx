import React, { PropsWithChildren } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import ProfileCard from './ProfileCard';

type TProfilePopoverProps = {
  member: MemberWithUser;
};

const ProfilePopover: React.FC<TProfilePopoverProps & PropsWithChildren> = ({
  member,
  children,
}) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent side="right">
        <ProfileCard member={member} />
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
