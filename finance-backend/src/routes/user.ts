import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import type { Variables } from "../lib/types.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.js";

export const userRoutes = new Hono<{
  Variables: Variables;
}>()

  .get(
    "/all",
    authenticate,
    authorize(["ADMIN"]),
    async (c) => {
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
      } catch (error) {
        return c.json(
          { error: "Failed to fetch users" },
          500,
        );
      }
    },
  )

 .get("/:userId", authenticate, async (c) => {
  const { userId } = c.req.param();
  const currentUser = c.get("user");
  
  // 1. Grab the filters from the query string
  const { category, type, date } = c.req.query();

  // Security Check
  if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
    return c.json({ error: "Unauthorized access to profile" }, 403);
  }

  if (!userId) {
    return c.json({ error: "User ID is required" }, 400);
  }

  // Parse transaction type for Prisma
  const parsedType = (type === "INCOME" || type === "EXPENSE") ? type : undefined;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        // 2. Apply the filters inside the Transactions relation
        Transactions: {
          where: {
            ...(category && { 
              category: { contains: category, mode: 'insensitive' } 
            }),
            ...(parsedType && { type: parsedType }),
            ...(date && {
              date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lte: new Date(`${date}T23:59:59.999Z`),
              }
            }),
          },
          // Removed 'take: 10' so the user can see all filtered results
          orderBy: { date: "desc" },
        },
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (e) {
    console.error("User Details Fetch Error:", e);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
