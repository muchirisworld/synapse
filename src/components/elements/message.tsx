"use client";

import React, { useState } from 'react';
import { Id, Doc } from '../../../convex/_generated/dataModel';
import { format, isToday, isYesterday } from 'date-fns';
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from '@/components/ui/avatar';
import Toolbar from './toolbar';
import { useUpdateMessage } from '@/hooks/use-update-message';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDeleteMessage } from '@/hooks/use-delete-message';
import { useToggleReaction } from '@/hooks/use-toggle-reaction';
import Reactions from './reactions';
import TextEditor from '../rich-text-editor';
import Hint from './hint';
// import { usePanel } from '@/hooks/use-panel';
// import ThreadBar from './thread-bar';

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss")}`;
}

type MessageProps = {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["content"];
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt?: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount: number;
    threadTimestamp?: number;
};

const Message: React.FC<MessageProps> = ({
    id,
    memberId,
    authorImage,
    authorName = "Member",
    isAuthor,
    reactions,
    body,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadTimestamp,
}) => {
    const { mutateAsync: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutateAsync: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage();
    const { mutateAsync: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();
    
    // const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();
    const isPending = isUpdatingMessage;

    const handleUpdateMessage = (content: string) => {
        updateMessage({
            messageId: id,
            content,
        }, {
            onSuccess: () => {
                toast.success('Message updated');
                setEditingId(null);
            },
            onError: () => {
                toast.error('Failed to update message');
            }
        });
        setEditingId(null);
    }

    const handleDeleteMessage = () => {
        deleteMessage({
            messageId: id,
        }, {
            onSuccess: () => {
                toast.success('Message deleted');

                // TODO: Close thread if open
                // if (parentMessageId === id) {
                //     onCloseMessage();
                // }
            },
            onError: () => {
                toast.error('Failed to delete message');
            }
        });
    }

    const handleToggleReaction = (value: any) => {
        toggleReaction({
            messageId: id,
            value: value.native,
        }, {
            onError: () => {
                toast.error('Failed to add reaction');
            }
        });
    }

    const handleCancelEdit = () => {
        setEditingId(null);
    }

    if (isCompact) {
        return (
            <div className={cn(
                'relative flex leading-tight flex-col gap-2 p-1.5 pl-10 pr-1.5 transition-all group',
                isEditing ? 'bg-[#f2c74433]'
                : 'hover:bg-muted'
            )}>
                <div className="flex items-start gap-2">
                    <Hint
                        label={formatFullTime(new Date(createdAt))}
                    >
                        <button className='text-xs text-muted-foreground text-center hover:underline'>
                            {format(new Date(createdAt), 'hh:mm a')}
                        </button>
                    </Hint>
                </div>
                {isEditing ? (
                    <div className="w-full h-full">
                        <TextEditor
                            initialValue={body}
                            onSend={handleUpdateMessage}
                            isEditing={isEditing}
                            handleCancel={handleCancelEdit}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        <div className="text-base" dangerouslySetInnerHTML={{ __html: body }} />
                        {updatedAt && (
                            <div className="text-xs text-muted-foreground">
                                Edited
                            </div>
                        )}
                        <Reactions
                            data={reactions}
                            onChange={handleToggleReaction}
                            // isPending={isTogglingReaction}
                        />
                        {/* <ThreadBar
                            count={threadCount}
                            timestamp={threadTimestamp}
                            onClick={() => onOpenMessage(id)}
                        /> */}
                    </div>
                )}
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={false}
                        handleEdit={() => setEditingId(id)}
                        // handleThread={() => onOpenMessage(id)}
                        handleDelete={handleDeleteMessage}
                        handleReaction={handleToggleReaction}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        )
    }

    const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div className={cn(
        'relative flex flex-col gap-2 p-1.5 transition-all group',
        isEditing ? 'bg-[#f2c74433]'
        : 'hover:bg-muted'
    )}>
        <div className="flex items-start gap-2">
            <button>
                <Avatar className='size-7 rounded-md'>
                    <AvatarImage src={authorImage} />
                    <AvatarFallback>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </button>
            {isEditing ? (
                <div className="w-full h-full">
                    <TextEditor
                        initialValue={body}
                        onSend={handleUpdateMessage}
                        isEditing={isEditing}
                        handleCancel={handleCancelEdit}
                    />
                </div>
            ) : (
            <div className="flex flex-col w-full overflow-hidden">
                <div className="text-base">
                    <button
                        onClick={() => {}}
                        className='font-bold text-primary hover:underline'
                    >
                        {authorName}
                    </button>
                    <span className="">
                        &nbsp;•&nbsp;
                    </span>
                    <Hint
                        label={formatFullTime(new Date(createdAt))}
                    >
                        <button className='text-xs text-muted-foreground hover:underline'>
                            {format(new Date(createdAt), 'hh:mm a')}
                        </button>
                    </Hint>
                </div>
                <div className="flex flex-col w-full">
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: body }} />
                    {updatedAt && (
                        <div className="text-xs text-muted-foreground">
                            Edited
                        </div>
                    )}
                    <Reactions
                        data={reactions}
                        onChange={handleToggleReaction}
                        // isPending={isTogglingReaction}
                    />
                    {/* <ThreadBar
                        count={threadCount}
                        timestamp={threadTimestamp}
                        onClick={() => onOpenMessage(id)}
                    /> */}
                </div>
            </div>
            )}
        </div>
        {!isEditing && (
            <Toolbar
                isAuthor={isAuthor}
                isPending={false}
                handleEdit={() => setEditingId(id)}
                // handleThread={() => onOpenMessage(id)}
                handleDelete={handleDeleteMessage}
                handleReaction={handleToggleReaction}
                hideThreadButton={hideThreadButton}
            />
        )}
    </div>
  )
}

export default Message