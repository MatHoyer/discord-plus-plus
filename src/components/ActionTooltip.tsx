import React, { ComponentProps, PropsWithChildren } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type TActionTooltipProps = {
  label: string;
  delayDuration?: number;
};

const ActionTooltip: React.FC<
  TActionTooltipProps &
    PropsWithChildren &
    ComponentProps<typeof TooltipContent>
> = ({ label, children, delayDuration, ...props }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>
          <p className="font-semibold text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
