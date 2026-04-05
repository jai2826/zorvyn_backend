import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { TransactionType } from "../../prisma/generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { Variables } from "../lib/types.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.js";

// Validation schema
const createSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required"),
  date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  description: z.string().max(255).optional(),
});

// --- CHAINED ROUTES ---
// We assign the chain to the export so the frontend can "see" every method.
export const transactionRoutes = new Hono<{
  Variables: Variables;
}>()
  // 1. GET ALL
  .get("/", authenticate, async (c) => {
    const user = c.get("user");
    const { category, type, userId } = c.req.query();

    try {
      const transactions =
        await prisma.transaction.findMany({
          where: {
            // Logic: Admins can filter by userId, regular users are locked to their own ID
            userId:
              user.role === "ADMIN"
                ? (userId ?? user.id)
                : user.id,
            ...(category && { category }),
            ...(type
              ? { type: type as TransactionType }
              : {}),
          },
          orderBy: { createdAt: "desc" },
          include: {
            User: {
              select: { id: true, role: true, email: true },
            },
          },
        });

      return c.json(transactions);
    } catch (error) {
      console.error("Fetch Transactions Error:", error);
      return c.json(
        { error: "Internal Server Error" },
        500,
      );
    }
  })

  // 2. CREATE (Admin Only)
  .post(
    "/create/:userId",
    authenticate,
    authorize(["ADMIN"]),
    zValidator("json", createSchema),
    async (c) => {
      const userId = c.req.param("userId");
      const data = c.req.valid("json");

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.isActive === false) {
        return c.json(
          {
            error:
              "Cannot add transactions to a deactivated account. First activate the account.",
          },
          403,
        );
      }

      try {
        const newRecord = await prisma.transaction.create({
          data: {
            id: uuidv4(),
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: data.date,
            userId: userId,
            description: data.description ?? "",
          },
        });

        return c.json(newRecord, 201);
      } catch (error) {
        console.error(error);
        return c.json(
          { error: "Could not create transaction" },
          500,
        );
      }
    },
  )

  // 3. UPDATE (Admin Only)
  .patch(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    zValidator("json", createSchema.partial()),
    async (c) => {
      const { id } = c.req.param();
      const data = c.req.valid("json");

      try {
        const record = await prisma.transaction.update({
          where: { id },
          data: {
            ...(data.type && { type: data.type }),
            ...(data.category && {
              category: data.category,
            }),
            ...(data.description !== undefined && {
              description: data.description,
            }),
            ...(data.date && { date: data.date }),
            ...(data.amount !== undefined && {
              amount: data.amount,
            }),
          },
        });
        return c.json(record);
      } catch (error) {
        return c.json({ error: "Update failed" }, 404);
      }
    },
  )

  // 4. DELETE (Admin Only)
  .delete(
    "delete/:id",
    authenticate,
    authorize(["ADMIN"]),
    async (c) => {
      const { id } = c.req.param();
      if (!id) {
        return c.json(
          { error: "Transaction ID is required" },
          400,
        );
      }
      try {
        await prisma.transaction.delete({ where: { id } });
        return c.json({ message: "Deleted successfully" });
      } catch (error) {
        return c.json({ error: "Record not found" }, 404);
      }
    },
  );
