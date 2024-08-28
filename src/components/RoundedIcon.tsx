'use client';
import { cn } from '@/lib/utils';
import React, { ComponentProps, PropsWithChildren } from 'react';

const RoundedIcon: React.FC<
  { className?: string } & PropsWithChildren & ComponentProps<'div'>
> = ({ children, className, ...props }) => (
  <div
    {...props}
    className={cn(
      'flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center',
      className
    )}
  >
    {children}
  </div>
);

export default RoundedIcon;
