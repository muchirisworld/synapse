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
import { useAuthActions } from "@convex-dev/auth/react";
import { PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import useConfirm from '@/hooks/use-confirm';

const ProfileCard = () => {
    const { signOut } = useAuthActions();
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You will be signed out of your account when this action is completed"
    });

    const handleSignOut = async () => {
        const ok = await confirm();
        if (!ok) return;
        signOut();
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
                    <h3 className="">developedbyrobbie@gmail.com</h3>
                    <p className="text-muted-foreground text-sm">Robert Muchiri</p>
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
  return (
    <AvatarButton
        alt={"Robert Muchiri"}
        fallback={"C"}
        imageUrl={""}
        className='size-9'
    />
  )
}