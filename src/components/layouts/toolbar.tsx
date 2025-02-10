import React from 'react';
import { UserButton } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ModeToggle } from '@/components/elements/mode-toggle';
import { Button } from '../ui/button';
import ProfileCard from '../elements/profile-card';
import Hint from '../elements/hint';
import { currentUser } from '@clerk/nextjs/server';

const Toolbar = () => {
  return (
    <div className="">
        <div className='overflow-y-hidden sticky top-2 h-[calc(100vh-16px)]'>
            <ToolbarItems />
        </div>
    </div>
  )
}

export default Toolbar

const ToolbarItems = async () => {
    const user = await currentUser();
    return (
        <aside className='z-20 flex h-full flex-col'>
            <nav className="px-1 py-4">
                <Button
                    size={'icon'}
                >
                    P
                </Button>
            </nav>
  
            <nav className='mt-auto grid gap-2 px-2 py-4'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ModeToggle />
                        </TooltipTrigger>
                        <TooltipContent side='right' sideOffset={5}>
                            Theme
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
    
                <Hint
                    label={user?.fullName ?? 'Unknown User'}
                    align='center'
                    side='right'
                >
                    <div className=''>
                        <ProfileCard />
                    </div>
                </Hint>
            </nav>
        </aside>
    )
}