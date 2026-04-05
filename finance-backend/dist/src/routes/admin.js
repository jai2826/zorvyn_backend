import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import { authenticate, authorize, } from "../middleware/auth.js";
// We export the result of the chain directly.
// This is what allows Hono RPC to "see" your routes on the frontend.
export const adminRoutes = new Hono()
    // 1. GET ALL USERS
    .get("/users", authenticate, authorize(["ADMIN"]), async (c) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: { Transactions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return c.json(users);
    }
    catch (error) {
        return c.json({ error: "Failed to fetch user list" }, 500);
    }
})
    // 2. UPDATE USER STATUS OR ROLE
    .patch("/update/:userId", authenticate, authorize(["ADMIN"]), async (c) => {
    const { userId } = c.req.param();
    // Added a type hint here for better safety
    const { role, isActive } = await c.req.json();
    if (!userId) {
        return c.json({ error: "User ID is required" }, 400);
    }
    try {
        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(role && { role }),
                ...(isActive !== undefined && { isActive }),
            },
        });
        return c.json(updated);
    }
    catch (e) {
        return c.json({ error: "User not found" }, 404);
    }
})
    // 3. DELETE USER
    .delete("/user/:userId", authenticate, authorize(["ADMIN"]), async (c) => {
    const { userId } = c.req.param();
    if (!userId) {
        return c.json({ error: "User ID is required" }, 400);
    }
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        return c.json({
            message: "User deleted successfully",
        });
    }
    catch (e) {
        return c.json({ error: "User not found" }, 404);
    }
})
    // 4. SYSTEM-WIDE TRANSACTION OVERVIEW
    .get("/transactions/all", authenticate, authorize(["ADMIN"]), async (c) => {
    try {
        const allTransactions = await prisma.transaction.findMany({
            include: {
                User: {
                    select: { createdAt: true, email: true },
                },
            },
            orderBy: { date: "desc" },
            take: 100, // Good safety limit
        });
        return c.json(allTransactions);
    }
    catch (error) {
        return c.json({ error: "Failed to fetch global transactions" }, 500);
    }
});
//# sourceMappingURL=admin.js.map