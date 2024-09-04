import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { avatarVariants } from './UserAvatarWithActivity';

type TUserAvatarProps = {
  src?: string | null;
  className?: string;
};

const UserAvatar: React.FC<
  TUserAvatarProps & VariantProps<typeof avatarVariants>
> = ({ src, className, size }) => {
  return !!src ? (
    <Avatar className={cn(avatarVariants({ className, size }))}>
      <AvatarImage src={src} />
    </Avatar>
  ) : (
    <div></div>
  );
};

export default UserAvatar;
