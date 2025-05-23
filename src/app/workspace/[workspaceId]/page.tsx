"use client";

import { useCurrentMember } from '@/hooks/use-current-member';
import { useGetChannels } from '@/hooks/use-get-channels';
import { useChannelStore } from '@/store/channel';
import React, { useEffect, useMemo } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetWorkspaceById } from '@/hooks/use-get-workspaces';
import { useParams, useRouter } from 'next/navigation';
import { Loader, TriangleAlert } from 'lucide-react';

const WorkspaceIdPage = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { open, setOpen } = useChannelStore((state) => state);
    const router = useRouter();

    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById(workspaceId as Id<"workspaces">);
    const { data: channels, isLoading: channelsLoading } = useGetChannels(workspaceId as Id<"workspaces">);
    const { data: member, isLoading: memberLoading } = useCurrentMember(workspaceId as Id<"workspaces">);    

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);
  
    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;
    
        if (channelId) {
            router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        member,
        memberLoading,
        isAdmin,
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        open,
        router,
        setOpen,
        workspaceId
    ]);
  

    if (workspaceLoading || channelsLoading || memberLoading) {
        return (
            <div className="h-full flex items-center justify-center flex-col gap-2">
                <Loader className='size-6 animate-spin text-muted-foreground' />
            </div>
        );
      }
    
      if (!workspace || !member) {
        return (
            <div className="h-full flex items-center justify-center flex-col gap-2">
                <TriangleAlert className='size-6 text-muted-foreground' />
                <span className="text-sm text-muted-foreground">
                    Workspace not found
                </span>
            </div>
        );
      }
    
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
        <TriangleAlert className='size-6 text-muted-foreground' />
        <span className="text-sm text-muted-foreground">
            No channels found
        </span>
    </div>
  )
}

export default WorkspaceIdPage;
