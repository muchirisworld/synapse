import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized!")
        }

        const workspace = await ctx.db.get(args.workspaceId);
 
        if (!workspace) {
            throw new Error("Workspace not found!")
        }

        if (workspace.joinCode !== args.joinCode) {
            throw new Error("Invalid join code!")
        }

        const existingMember = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique();

        if (existingMember) {
            throw new Error("Already a member of this workspace")
        }

        await ctx.db
            .insert("members", {
                userId: userId,
                workspaceId: workspace._id,
                role: "member"
            })

        return workspace._id;
    }
});

export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized!")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

            if (!member || member.role !== "admin") {
                throw new Error("Unauthorized!")
            }

        const joinCode = generateRandomString();

        await ctx.db
            .patch(args.workspaceId, {
                joinCode
            });

        return args.workspaceId;
    }
})

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

        await ctx.db.insert("members", {
            userId: userId,
            workspaceId,
            role: "admin"
        });

        await ctx.db.insert("channels", {
            name: "general",
            workspaceId
        });

        return workspaceId;
    }
});

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return []
        };

        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        const workspaceIds = members.map((member) => member.workspaceId);
        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);

            if (workspace) {
                workspaces.push(workspace);
            }
        };

        return workspaces; 
    }
});

export const getBasicInfoById = query({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }
        
        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique(); 

        const workspace = await ctx.db.get(args.workspaceId);

        return {
            name: workspace?.name,
            isMember: !!member
        };
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

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique();

        if (!member) {
            return null;  
        }

        return await ctx.db.get(args.workspaceId);
    }
});

export const update = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized!");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique();
        
        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized!");
        }

        await ctx.db.patch(args.workspaceId, { name: args.name });
        return args.workspaceId;
    }
});

export const remove = mutation({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized!");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique();
        
        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized!");
        }

        const [members] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect()
        ]);

        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        await ctx.db.delete(args.workspaceId);
        return args.workspaceId;
    }
});