'use client';
import { cn } from '@/lib/utils';
import React, { ComponentProps, PropsWithChildren } from 'react';
import ActionTooltip from '../ActionTooltip';
import RoundedIcon from '../RoundedIcon';

type TNavigationItemWithIndicatorProps = {
  isSelected: boolean;
  onClick: () => void;
};

const NavigationItemWithIndicator: React.FC<
  TNavigationItemWithIndicatorProps &
    PropsWithChildren &
    ComponentProps<typeof ActionTooltip>
> = ({ isSelected, onClick, children, ...props }) => {
  return (
    <ActionTooltip {...props}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px] opacity-0',
            isSelected && 'h-[36px] opacity-100',
            !isSelected && 'group-hover:h-[20px] opacity-100'
          )}
        />
        <RoundedIcon
          className={cn(
            'bg-red-500',
            isSelected && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          {children}
        </RoundedIcon>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItemWithIndicator;
