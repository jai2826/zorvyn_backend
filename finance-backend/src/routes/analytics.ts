import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import type { Variables } from "../lib/types.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.js";



export const analyticsRoutes = new Hono<{
  Variables: Variables;
}>()
  .get(
    "/summary",
    authenticate,
    authorize(["ANALYST", "ADMIN"]),
    async (c) => {

      try {
        
        const stats = await prisma.transaction.groupBy({
          by: ["type"],
          
          _sum: { amount: true },
        });

        
        const categories = await prisma.transaction.groupBy(
          {
            by: ["category", "type"],
            _sum: { amount: true },
            _count: { category: true },
          },
        );

        
        const incomeCategories = categories
          .filter((cat) => cat.type === "INCOME")
          .map((cat) => ({
            category: cat.category,
            count: Number(cat._count.category || 0),
            amount: Number(cat._sum.amount || 0),
          }));

        const expenseCategories = categories
          .filter((cat) => cat.type === "EXPENSE")
          .map((cat) => ({
            category: cat.category,
            count: Number(cat._count.category || 0),
            amount: Number(cat._sum.amount || 0),
          }));

        
        const totalIncome = Number(
          stats.find((s) => s.type === "INCOME")?._sum
            .amount || 0,
        );
        const totalExpense = Number(
          stats.find((s) => s.type === "EXPENSE")?._sum
            .amount || 0,
        );

        return c.json({
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
          
          incomeByCategories: incomeCategories,
          expenseByCategories: expenseCategories,
        });
      } catch (error) {
        console.error("Analytics Error:", error);
        return c.json(
          { error: "Analytics calculation failed" },
          500,
        );
      }
    },
  )
  .get("/user/summary", authenticate, authorize(["ANALYST", "ADMIN"]), async (c) => {
  try {
    const usersWithStats = await prisma.user.findMany({
      include: { Transactions: true },
    });

    const summary = usersWithStats.map((u) => {
      const totalIncome = u.Transactions
        .filter((t) => t.type === "INCOME")
        .reduce((acc, t) => acc + Number(t.amount), 0);
      const totalExpense = u.Transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((acc, t) => acc + Number(t.amount), 0);

      return {
        id: u.id,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        transactionCount: u.Transactions.length, 
        totalIncome: totalIncome,             
        totalExpense: totalExpense,             
        netBalance: totalIncome - totalExpense, 
        isRisk: (totalIncome - totalExpense) < 0, 
      };
    });

    return c.json(summary);
  } catch (error) {
    return c.json({ error: "Failed" }, 500);
  }
});
