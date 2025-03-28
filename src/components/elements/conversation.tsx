"use client";

import React from "react";
import { useGetMember } from "@/hooks/use-get-member";
import { Id } from "../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useGetMessages } from "@/hooks/use-get-messages";
import { Loader } from "lucide-react";
import ConversationHeader from "./conversation-header";
import MessageList from "./message-list";
import { useCreateMessage } from "@/hooks/use-create-message";
import { toast } from "sonner";
import TextEditor from "../rich-text-editor";

type ConversationProps = {
    id: Id<"conversations">;
};

const Conversation = ({ id }: ConversationProps) => {
    const { workspaceId, memberId } = useParams<{ workspaceId: string, memberId: string }>();
    const { data: member, isLoading: memberLoading } = useGetMember(memberId as Id<"members">);
    const { mutateAsync } = useCreateMessage();
    const { results: messages, status, loadMore, isLoading: messagesLoading } = useGetMessages({ conversationId: id });

    if (memberLoading || messagesLoading) {
        return (
          <div className="h-full flex-1 flex items-center justify-center">
            <Loader className='size-5 animate-spin text-muted-foreground' />
          </div>
        );
    }

    const handleCreateMessage = (content: string) => {
        mutateAsync({
            workspaceId: workspaceId as Id<"workspaces">,
            conversationId: id,
            content: content
        }, {
            onError: () => {
                toast.error('Failed to send message');
            }
        });
    }

    return (
        <div className="flex flex-col h-full">
            <ConversationHeader
                title={member?.user.name!}
                memberImage={member?.user.image}
                onClick={() => {}}
            />

            <MessageList
                data={messages}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                canLoadMore={status === 'CanLoadMore'}
                isLoadingMore={status === 'LoadingMore'}
                loadMore={loadMore}
                
            />
            
            <div className="p-2">
                <TextEditor
                    onSend={handleCreateMessage}
                    className='max-h-[400px]'
                />
            </div>
        </div>
    );
}

export default Conversation;
