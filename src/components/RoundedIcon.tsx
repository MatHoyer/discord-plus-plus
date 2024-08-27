import { cn } from '@/lib/utils';
import React, { PropsWithChildren } from 'react';
import { ButtonProps } from './ui/button';

const RoundedIcon: React.FC<PropsWithChildren & ButtonProps> = ({ children, className, ...props }) => {
  return (
    <span
      {...props}
      className={cn(
        'flex items-center justify-center bg-gray-600 w-[50px] h-[50px] cursor-pointer rounded-icon',
        className
      )}
    >
      {children}
    </span>
  );
};

export default RoundedIcon;
