import { cn } from '@/lib/utils';
import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

type TUserAvatarProps = {
  src?: string | null;
  className?: string;
};

const UserAvatar: React.FC<TUserAvatarProps> = ({ src, className }) => {
  return !!src ? (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  ) : (
    <div></div>
  );
};

export default UserAvatar;
