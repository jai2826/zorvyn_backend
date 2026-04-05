import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import { authenticate, authorize, } from "../middleware/auth.js";
// 1. You MUST include <{ Variables: Variables }> so 'c.get("user")' works.
export const userRoutes = new Hono()
    // 2. GET all users (Admin only)
    .get("/all", authenticate, authorize(["ADMIN"]), async (c) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
        return c.json(users);
    }
    catch (error) {
        return c.json({ error: "Failed to fetch users" }, 500);
    }
})
    // 3. GET current user profile
    .get("/:userId", authenticate, async (c) => {
    const { userId } = c.req.param();
    const currentUser = c.get("user");
    // SECURITY: Prevent users from snooping on other profiles unless they are ADMIN
    if (currentUser.id !== userId &&
        currentUser.role !== "ADMIN") {
        return c.json({ error: "Unauthorized access to profile" }, 403);
    }
    if (!userId) {
        return c.json({ error: "User ID is required" }, 400);
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                Transactions: {
                    take: 10, // PERFORMANCE: Don't dump the entire DB in one profile call
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json(user);
    }
    catch (e) {
        console.error(e);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});
//# sourceMappingURL=user.js.map