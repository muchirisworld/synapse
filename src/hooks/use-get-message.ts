"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../convex/_generated/dataModel";

export const useGetMessage = (messageId: Id<"messages">) => {
    return useQuery(
        convexQuery(api.message.getById, { messageId })
    );
};