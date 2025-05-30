"use client";

import React, { useState } from 'react';
import { Id } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/button';
import { AlertTriangle, Loader, X } from 'lucide-react';
import { useGetMessage } from '@/hooks/use-get-message';
import { MessagesReturnProps, useGetMessages } from '@/hooks/use-get-messages';
import Message from './message';
import { useCurrentMember } from '@/hooks/use-current-member';
import { useParams } from 'next/navigation';
import { useCreateMessage } from '@/hooks/use-create-message';
import { toast } from 'sonner';
import { format } from 'date-fns';
import TextEditor from '../rich-text-editor';
import MessageList from './message-list';

type ThreadProps = {
    messageId: Id<"messages">;
    onClose: () => void;     
}

const Thread: React.FC<ThreadProps> = ({ messageId, onClose }) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const { workspaceId, channelId } = useParams<{ workspaceId: string, channelId: string }>();
    const { data: currentMember } = useCurrentMember(workspaceId as Id<"workspaces">);
    const { mutateAsync: replyMessageMutation } = useCreateMessage();
    const { data: message, isLoading: isLoadingMessage } = useGetMessage(messageId);
    const { results: messages, status, loadMore, isLoading: messagesLoading } = useGetMessages({
      channelId: channelId as Id<"channels">,
      parentMessageId: messageId
    });

    // const messages = messagesData as MessagesReturnProps;

    if (isLoadingMessage) {
        return (
            
            <div className='h-full flex flex-col'>
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        size={'icon'}
                    >
                        <X className='size-5 stroke-[1.5]' />
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className='shrink-0 animate-spin size-5 text-muted-foreground' />
                </div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className='h-full flex flex-col'>
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        size={'icon'}
                    >
                        <X className='size-5 stroke-[1.5]' />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className='shrink-0 size-5 text-muted-foreground' />
                    <p className="text-sm text-muted-foreground">
                        Message not found
                    </p>
                </div>
            </div>
        )
    }

    const handleReplyMessage = (content: string) => {
        replyMessageMutation({
            workspaceId: workspaceId as Id<"workspaces">,
            channelId: channelId as Id<"channels">,
            parentMessageId: messageId,
            content
        }, {
            onError: () => {
              toast.error('Failed to create message');
            }
        });
    }

    return (
        <div className='h-full flex flex-col pb-2 max-h-[calc(100vh-1rem)]'>
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button
                    variant='ghost'
                    onClick={onClose}
                    size={'icon'}
                >
                    <X className='size-5 stroke-[1.5]' />
                </Button>
            </div>

            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto">
                <MessageList
                    canLoadMore={status === 'CanLoadMore'}
                    data={messages}
                    isLoadingMore={status === 'LoadingMore'}
                    loadMore={loadMore}
                    variant='thread'
                />
                
                <Message
                    hideThreadButton
                    memberId={message.memberId}
                    authorImage={message.user.image}
                    isAuthor={message.memberId === currentMember?._id}
                    body={message.content}
                    createdAt={message._creationTime}
                    updatedAt={message.updatedAt}
                    id={message._id}
                    reactions={message.reactions}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    threadCount={message.threadCount}
                />
            </div>
            <div className="px-2">
                <TextEditor
                    onSend={handleReplyMessage}
                    isEditing={false}
                />
            </div>
        </div>
    )
}

export default Thread