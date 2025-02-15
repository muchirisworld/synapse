import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
};

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return []
        };

        // const members = await ctx.db
        //     .query("members")
        //     .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        //     .collect();

        // const workspaceIds = members.map((member) => member.workspaceId);
        // const workspaces = [];

        // for (const workspaceId of workspaceIds) {
        //     const workspace = await ctx.db.get(workspaceId);

        //     if (workspace) {
        //         workspaces.push(workspace);
        //     }
        // };
        const workspaces = await ctx.db.query("workspaces").collect();

        return workspaces; 
    }
});

export const create = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {  
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized!");
        }

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode: generateRandomString(),
            userId: userId
        });

        // await ctx.db.insert("members", {
        //     userId: args.userId,
        //     workspaceId,
        //     role: "admin"
        // });

        // await ctx.db.insert("channels", {
        //     name: "general",
        //     workspaceId
        // });

        return workspaceId;
    }
});

export const getById = query({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        
        if (!userId) {
            throw new Error("Unauthorized!");
        }

        // const member = await ctx.db
        //     .query("members")
        //     .withIndex("by_user_id_workspace_id", (q) =>
        //         q.eq("userId", args.userId).eq("workspaceId", args.workspaceId)
        //     )
        //     .unique();

        // if (!member) {
        //     return null;  
        // }

        return await ctx.db.get(args.workspaceId);
    }
});