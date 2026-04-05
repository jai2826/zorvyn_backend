import type { Variables } from "../lib/types.js";
export declare const analyticsRoutes: import("hono/hono-base").HonoBase<{
    Variables: Variables;
}, {
    "/summary": {
        $get: {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                totalIncome: number;
                totalExpense: number;
                netBalance: number;
                incomeByCategories: {
                    category: string | null;
                    count: number;
                    amount: number;
                }[];
                expenseByCategories: {
                    category: string | null;
                    count: number;
                    amount: number;
                }[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/user/summary": {
        $get: {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                id: string;
                email: string;
                role: string;
                isActive: boolean;
                transactionCount: number;
                totalIncome: number;
                totalExpense: number;
                netBalance: number;
                isRisk: boolean;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {};
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/", "/user/summary">;
//# sourceMappingURL=analytics.d.ts.map