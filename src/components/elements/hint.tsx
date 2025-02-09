import React, { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type HintProps = {
    label:  string;
    children: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

const Hint = ({
    label, children, side, align
}: HintProps) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="font-medium text-xs">{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint
