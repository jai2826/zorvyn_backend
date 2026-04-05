import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import type { Variables } from "../lib/types.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.js";



export const adminRoutes = new Hono<{
  Variables: Variables;
}>()

  
  .get(
    "/users",
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
            createdAt: true,
            _count: {
              select: { Transactions: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return c.json(users);
      } catch (error) {
        return c.json(
          { error: "Failed to fetch user list" },
          500,
        );
      }
    },
  )

  
  .patch(
    "/update/:userId",
    authenticate,
    authorize(["ADMIN"]),
    async (c) => {
      const { userId } = c.req.param();
      
      const { role, isActive } = await c.req.json<{
        role?: any;
        isActive?: boolean;
      }>();

      if (!userId) {
        return c.json(
          { error: "User ID is required" },
          400,
        );
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
      } catch (e) {
        return c.json({ error: "User not found" }, 404);
      }
    },
  )

  
  .delete(
    "/user/:userId",
    authenticate,
    authorize(["ADMIN"]),
    async (c) => {
      const { userId } = c.req.param();
      if (!userId) {
        return c.json(
          { error: "User ID is required" },
          400,
        );
      }
      try {
        await prisma.user.delete({
          where: { id: userId },
        });
        return c.json({
          message: "User deleted successfully",
        });
      } catch (e) {
        return c.json({ error: "User not found" }, 404);
      }
    },
  )

  
  .get(
    "/transactions/all",
    authenticate,
    authorize(["ADMIN"]),
    async (c) => {
      try {
        const allTransactions =
          await prisma.transaction.findMany({
            include: {
              User: {
                select: { createdAt: true, email: true },
              },
            },
            orderBy: { date: "desc" },
            take: 100, 
          });
        return c.json(allTransactions);
      } catch (error) {
        return c.json(
          { error: "Failed to fetch global transactions" },
          500,
        );
      }
    },
  );
