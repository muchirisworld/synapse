"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";


export const useGetBasicInfo = (workspaceId: Id<"workspaces">) => {
    return useQuery(
        convexQuery(api.workspace.getBasicInfoById, { workspaceId })
    );
};