"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetConversation } from '@/hooks/use-get-conversation';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Conversation from '@/components/elements/conversation';

const MemberPage = () => {
    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
    const { workspaceId, memberId } = useParams<{ workspaceId: string, memberId: string }>();
    const { mutateAsync, isPending } = useGetConversation();

    useEffect(() => {
        mutateAsync({
            workspaceId: workspaceId as Id<"workspaces">,
            memberId: memberId as Id<"members">
        }, {
            onSuccess: (data) => {
                setConversationId(data);
            },
            onError: () => {
                toast.error('Failed to get conversation');
            }
        });
    }, [mutateAsync, workspaceId, memberId]);

    if (isPending) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (!conversationId) {
        return (
            <div className="flex flex-col items-center justify-center">
                <AlertTriangle className='size-5 text-muted-foreground' />
                <p className="text-muted-foreground">No conversation found</p>
            </div>
        );
    }

  return <Conversation id={conversationId} />;
}

export default MemberPage;
