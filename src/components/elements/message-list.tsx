"use client";

import React, { useState } from 'react';
import { format, isToday, isYesterday, differenceInMinutes } from 'date-fns';
import Message from './message';
import { Id } from '../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import { useCurrentMember } from '@/hooks/use-current-member';
import { MessagesReturnProps } from '@/hooks/use-get-messages';

const TIMETHRESHOLD = 5;

type MessageListProps = {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTime?: number;
    variant?: 'channel' | 'thread' | 'conversation';
    data: MessagesReturnProps | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
};

const formarDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM');
};

const MessageList = ({
    memberName,
    memberImage,
    channelName,
    channelCreationTime,
    variant = "channel",
    data,
    loadMore,
    isLoadingMore,
    canLoadMore
}: MessageListProps) => {
    const { workspaceId } = useParams<{ workspaceId: string }>();	

    const { data: currentMember } = useCurrentMember(workspaceId as Id<"workspaces">); 
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    if (!data) {
        return null;
    }

    const groupedMessages = data.reduce((acc, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].unshift(message);
        return acc;
    }, {} as Record<string, MessagesReturnProps>);
  return (
    // <div className="h-full overflow-y-auto px-6 py-4">
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto">
        {Object.entries(groupedMessages || {}).map(([date, messages]) => (
            <div key={date} className="">
                <div className="text-center my-2 relative">
                    <hr className='absolute top-1/2 left--0 right-0 border-t border-muted-foreground' />
                    <span className='relative inline-block px-4 py-1 rounded-full text-xs border border-muted-foreground shadow-sm'>
                        {formarDateLabel(date)}
                    </span>
                </div>
                {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const isCompact =
                        prevMessage &&
                        prevMessage.user._id === message.user._id &&
                        differenceInMinutes(
                            new Date(message._creationTime),
                            new Date(prevMessage._creationTime)
                        ) < TIMETHRESHOLD;
                    return (
                        <Message
                            key={message._id}
                            id={message._id}
                            memberId={message.memberId}
                            authorImage={message.user.image}
                            authorName={`${message.user.name}`}
                            isAuthor={message.memberId === currentMember?._id}
                            reactions={message.reactions.map(reaction => ({
                                ...reaction,
                                memberId: reaction.memberIds[0], // Assuming the first memberId is used
                            }))}
                            body={message.content}
                            updatedAt={message.updatedAt}
                            createdAt={message._creationTime}
                            isEditing={editingId === message._id}
                            setEditingId={setEditingId}
                            isCompact={isCompact}
                            hideThreadButton={variant === 'thread'}
                            threadCount={message.threadCount}
                            threadTimestamp={message.threadTimestamp}
                        />)
                })}
            </div>
        ))}
    </div>
  )
}

export default MessageList