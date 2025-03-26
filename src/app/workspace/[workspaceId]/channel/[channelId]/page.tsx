"use client";

import { useGetChannel } from '@/hooks/use-get-channel';
import React, { FormEvent, useState } from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Loader, TriangleAlert } from 'lucide-react';
import ChannelHeader from '@/components/elements/channel-header';
import TextEditor from '@/components/rich-text-editor';
import { useParams } from 'next/navigation';

const ChannelPage = () => {
    const { channelId } = useParams<{ channelId: string }>();
    const [value, setValue] = useState("");

    const { data: channel, isLoading: channelLoading } = useGetChannel(channelId as Id<"channels">);


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(value);
    }

    if (channelLoading) {
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

    return (
        <div className="flex flex-col h-full">
            <ChannelHeader title={channel.name} />

            <div className="flex-1"></div>
            <div className="p-2">
                <TextEditor
                    value={value}
                    onChange={setValue}
                    onSend={() => handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>)}
                />
            </div>
        </div>
    );
};

export default ChannelPage;
