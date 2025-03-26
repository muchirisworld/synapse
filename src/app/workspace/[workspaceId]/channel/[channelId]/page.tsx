"use client";

import { useGetChannel } from '@/hooks/use-get-channel';
import React, { FormEvent, useState } from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Loader, TriangleAlert } from 'lucide-react';
import ChannelHeader from '@/components/elements/channel-header';
import TextEditor from '@/components/rich-text-editor';
import { useParams } from 'next/navigation';
import { useGetMessages } from '@/hooks/use-get-messages';
import MessageList from '@/components/elements/message-list';
import { useCreateMessage } from '@/hooks/use-create-message';
import { toast } from 'sonner';

const ChannelPage = () => {
    const { workspaceId, channelId } = useParams<{ workspaceId: string, channelId: string }>();

    const { results, status, loadMore } = useGetMessages({ channelId: channelId as Id<"channels"> });
    const { data: channel, isLoading: channelLoading } = useGetChannel(channelId as Id<"channels">);

    const { mutateAsync } = useCreateMessage();

    if (channelLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex gap-y-2 items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Channel not found</p>
            </div>
        );
    }
    
    const handleCreateMessage = (body: string) => {
        mutateAsync({
            workspaceId: workspaceId as Id<"workspaces">,
            channelId: channelId as Id<"channels">,
            content: body
        }, {
            onSuccess: () => {
                () => {}
            },
            onError: () => {
                toast.error('Failed to create message');
            }
        });
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-1rem)]">
            <ChannelHeader title={channel.name} />

            <MessageList
                canLoadMore={status === 'CanLoadMore'}
                data={results}
                isLoadingMore={status === 'LoadingMore'}
                loadMore={loadMore}
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
            />

            <div className="p-2">
                <TextEditor
                    onSend={handleCreateMessage}
                    className='max-h-[400px]'
                />
            </div>
        </div>
    );
};

export default ChannelPage;
