import type {
  InferRequestType,
  InferResponseType,
} from "hono/client";
import { client } from "./api";



export type Transactions = InferResponseType<
  typeof client.api.transactions.$get,
  200
>;
export type Transaction = Transactions extends (infer T)[]
  ? T
  : Transactions;


export type CreateTransactionSchema = InferRequestType<
  (typeof client.api.transactions.create)[":userId"]["$post"]
>["json"];
export type CreateTransactionError = InferResponseType<
  (typeof client.api.transactions.create)[":userId"]["$post"],
  401 | 403
>;


export type User = InferResponseType<
  (typeof client.api.users)[":userId"]["$get"],
  200
>;



export type AdminUserListResponse = InferResponseType<
  typeof client.api.admin.users.$get,
  200
>;
export type AdminUser =
  AdminUserListResponse extends (infer T)[]
    ? T
    : AdminUserListResponse;


export type UpdateUserRequest = InferRequestType<
  (typeof client.api.admin.update)[":userId"]
>["json"];



export type LoginResponse = InferResponseType<
  typeof client.api.auth.login.$post,
  200
>;
export type LoginErrorResponse = InferResponseType<
  typeof client.api.auth.login.$post,
  401 | 403
>;



export type AnalyticsSummaryResponse = InferResponseType<
  typeof client.api.analytics.summary.$get,
  200
>;


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
