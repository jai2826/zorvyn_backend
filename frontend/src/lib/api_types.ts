import type {
  InferResponseType,
  InferRequestType,
} from "hono/client";
import { client } from "./api";

// --- TRANSACTIONS ---
// Response: Array of transactions with joined User data
export type Transactions = InferResponseType<
  typeof client.api.transactions.$get,
  200
>;
export type Transaction = Transactions extends (infer T)[]
  ? T
  : Transactions;

// Request: The JSON body for creating a transaction
export type CreateTransactionSchema = InferRequestType<
  (typeof client.api.transactions.create)[":userId"]["$post"]
>["json"];
export type CreateTransactionError = InferResponseType<
  (typeof client.api.transactions.create)[":userId"]["$post"],
  401 | 403
>;

// User
export type User = InferResponseType<
  (typeof client.api.users)[":userId"]["$get"],
  200
>;

// --- ADMIN / USERS ---
// Response: The specialized user list with _count from your adminRoutes
export type AdminUserListResponse = InferResponseType<
  typeof client.api.admin.users.$get,
  200
>;
export type AdminUser =
  AdminUserListResponse extends (infer T)[]
    ? T
    : AdminUserListResponse;

// Request: The PATCH body for updating users
export type UpdateUserRequest = InferRequestType<
  (typeof client.api.admin.update)[":userId"]
>["json"];

// --- AUTH (Example) ---
// If you have a login route, this ensures you have the exact shape of the user/token
export type LoginResponse = InferResponseType<
  typeof client.api.auth.login.$post,
  200
>;
export type LoginErrorResponse = InferResponseType<
  typeof client.api.auth.login.$post,
  401 | 403
>;

// --- ANALYTICS (Example) ---
// If you have an analytics summary route, this ensures you have the exact shape of the summary data
export type AnalyticsSummaryResponse = InferResponseType<
  typeof client.api.analytics.summary.$get,
  200
>;

// --- ERROR RESPONSE ---
export type ApiErrorResponse = {
  error: string;
  message?: string;
};

export type Summary = InferResponseType<
  typeof client.api.analytics.summary.$get,
  200
>;
export type UserSummary = InferResponseType<
  typeof client.api.analytics.user.summary.$get,
  200
>;
