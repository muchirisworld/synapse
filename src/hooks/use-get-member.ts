"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../convex/_generated/dataModel";

export const useGetMember = (memberId: Id<"members">) => {
    return useQuery(
        convexQuery(api.member.getById, { memberId })
    );
};