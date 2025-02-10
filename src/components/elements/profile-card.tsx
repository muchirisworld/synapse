"use client";

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
import useConfirm from '@/hooks/use-confirm';
import { useClerk, useUser } from '@clerk/nextjs';

const ProfileCard = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You will be signed out of your account when this action is completed"
    });

    const handleSignOut = async () => {
        const ok = await confirm();
        if (!ok) return;
        signOut({ redirectUrl: '/' });
    }

  return (
    <>
    <ConfirmDialog />

    <DropdownMenu>
        <DropdownMenuTrigger>
            <ProfileAvatar  />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='right'>
            <DropdownMenuLabel className='flex items-center gap-2'>
                <ProfileAvatar />
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
            
            <DropdownMenuItem className='cursor-pointer' onClick={handleSignOut}>
                <ExitIcon />
                Sign Out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default ProfileCard

const ProfileAvatar = () => {
    const { user } = useUser();

  return (
    <AvatarButton
        alt={user?.fullName ?? ""}
        fallback={"C"}
        imageUrl={user?.imageUrl}
        className='size-9'
    />
  )
}