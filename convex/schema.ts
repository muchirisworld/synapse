import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    user: defineTable({
        userId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        image: v.string()
    })
        .index("by_user_id", ["userId"])
});

export default schema;