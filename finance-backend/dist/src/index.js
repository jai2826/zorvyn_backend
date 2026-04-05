import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth.js";
import { transactionRoutes } from "./routes/transactions.js";
import { userRoutes } from "./routes/user.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { adminRoutes } from "./routes/admin.js";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
const app = new Hono();
app.use("*", logger());
app.use("*", cors());
// 1. Define the chain
const routes = app
    .basePath("/api")
    .route("/auth", authRoutes)
    .route("/transactions", transactionRoutes)
    .route("/users", userRoutes)
    .route("/analytics", analyticsRoutes)
    .route("/admin", adminRoutes);
// 3. SERVE the routes instance, not the 'app' instance
serve({
    fetch: routes.fetch, // <--- CHANGE THIS FROM app.fetch
    port: 3000
});
//# sourceMappingURL=index.js.map