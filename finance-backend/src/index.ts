import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { adminRoutes } from "./routes/admin.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { authRoutes } from "./routes/auth.js";
import { transactionRoutes } from "./routes/transactions.js";
import { userRoutes } from "./routes/user.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());


const routes = app
  .basePath("/api")
  .route("/auth", authRoutes)
  .route("/transactions", transactionRoutes)
  .route("/users", userRoutes)
  .route("/analytics", analyticsRoutes)
  .route("/admin", adminRoutes);


export type AppType = typeof routes;


serve({ 
  fetch: routes.fetch, 
  port: 3000 
});