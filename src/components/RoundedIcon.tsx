'use client';
import { cn } from '@/lib/utils';
import React, { ComponentProps, PropsWithChildren } from 'react';

const RoundedIcon: React.FC<
  { className?: string } & PropsWithChildren & ComponentProps<'span'>
> = ({ children, className, ...props }) => {
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
