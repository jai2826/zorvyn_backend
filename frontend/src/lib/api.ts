// frontend/src/lib/api.ts
import { hc } from "hono/client";
import type { AppType } from "../../../finance-backend/src/index";

// Create the client
export const client = hc<AppType>("http://localhost:3000");
