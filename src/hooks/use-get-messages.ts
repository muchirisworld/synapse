"use client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { PaginatedQueryReference, usePaginatedQuery } from "convex/react";

const BATCH_SIZE = 20;

type UseGetMessagesProps = {
    channelId?: Id<"channels">;
    conversationId?: Id<"conversations">;
    parentMessageId?: Id<"messages">;
};

export type MessagesReturnProps = Exclude<typeof api.message.get._returnType, never[]>["page"];

export const useGetMessages = ({
    channelId,
    conversationId,
    parentMessageId,
}: UseGetMessagesProps) => {

    const { results, isLoading, loadMore, status } = usePaginatedQuery(
            api.message.get as PaginatedQueryReference,
            { channelId, conversationId, parentMessageId },
            { initialNumItems: BATCH_SIZE }
        )
    
    return {
        results,
        isLoading,
        loadMore: () => loadMore(BATCH_SIZE),
        status
    }
};