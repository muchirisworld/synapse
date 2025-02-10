import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AvatarButton from './avatar-button';
import { currentUser, User } from '@clerk/nextjs/server';
import { PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const ProfileCard = async () => {
    const user = await currentUser();

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <ProfileAvatar user={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='right'>
            <DropdownMenuLabel className='flex items-center gap-2'>
                <ProfileAvatar user={user} />
                <div className="leading-tight">
                    <h3 className="">{user?.emailAddresses[0].emailAddress}</h3>
                    <p className="text-muted-foreground text-sm">{user?.fullName}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link
                href={'/workspace'}
            >
                <DropdownMenuItem className='cursor-pointer'>
                    <PersonIcon />
                    Profile
                </DropdownMenuItem>
            </Link>
            <Link
                href={'/workspace'}
    	        
            >
                <DropdownMenuItem className='cursor-pointer'>
                    <GearIcon />
                    Settings
                </DropdownMenuItem>
            </Link>
            
            <DropdownMenuItem className='cursor-pointer'>
                <ExitIcon />
                Sign Out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileCard

type ProfileAvatarProps = {
    user: User | null;
}

const ProfileAvatar = async ({ user }: ProfileAvatarProps) => {
  return (
    <AvatarButton
        alt={user?.fullName ?? ""}
        fallback={"C"}
        imageUrl={user?.imageUrl}
        className='size-9'
    />
  )
}