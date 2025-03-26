"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, Edit, Hash, Trash } from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogHeader
} from '@/components/ui/dialog';
import { EditChannelForm } from './edit-channel';
import { useParams } from 'next/navigation';
import { useDeleteChannel } from '@/hooks/use-delete-channel';
import { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCurrentMember } from '@/hooks/use-current-member';
import useConfirm from '@/hooks/use-confirm';

type ChannelHeaderProps = {
    title: string;
}

const ChannelHeader = ({ title }: ChannelHeaderProps) => {
    const { workspaceId, channelId } = useParams<{ workspaceId: string, channelId: string }>();
    const { data: member } = useCurrentMember(workspaceId as Id<"workspaces">);
    const [editOpen, setEditOpen] = useState(false);
    const { mutateAsync, isPending } = useDeleteChannel();
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "This action is irreversible and will result in permanent loss of data!"
    });

    const handleEditChannel = (value: boolean) => {
        if (member?.role !== "admin") return;
        setEditOpen(value);
    };

    const deleteChannel = () => {
        mutateAsync({
            channelId: channelId as Id<"channels">
        }, {
            onSuccess: () => {
                toast.success("Channel deleted successfully");
                router.replace(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to delete channel");
            }
        });
    };
    
    const handleDeleteChannel = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteChannel();
    }
  return (
    <div className='border-b h-[49px] flex items-center px-4'>
        <ConfirmDialog />

        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='sm'
                    className='text-lg font-semibold px-2 overflow-hidden w-auto'
                >
                    <Hash className='size-4' /> 
                    <span className='truncate'>{title}</span>
                    <ChevronDown className='size-4' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader
                    className='p-4 border-b'
                >
                    <DialogTitle className='flex items-center gap-2'>
                        <Hash className='size-4' />
                        <span className="">{title}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className='px-4 pb-4 flex-col gap-y-2'>
                    <Dialog open={editOpen} onOpenChange={handleEditChannel}>
                        <DialogTrigger asChild>
                            <div className="px-5 py-4 rounded-lg cursor-pointer hover:muted/50 transition-all">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Channel name</p>
                                    {member?.role == "admin" && <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>}
                                </div>
                                <p className="text-sm flex items-center">
                                    <Hash className='size-2' />
                                    <span className="ml-1">{title}</span>
                                </p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit channel name</DialogTitle>
                            </DialogHeader>

                            <EditChannelForm
                                initialName={title}
                                channelId={channelId}
                                setOpen={setEditOpen}
                            />
                        </DialogContent>
                    </Dialog>

                    {member?.role === "admin" &&
                    <Button
                        variant='outline'
                        size='icon'
                        onClick={handleDeleteChannel}
                        disabled={isPending}
                    >
                        <Trash className='size-4 text-rose-600' />
                    </Button>}
                </div>
            </DialogContent>
        </Dialog>
      
    </div>
  )
}

export default ChannelHeader;