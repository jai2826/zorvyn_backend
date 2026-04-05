import type { Variables } from "../lib/types.js";
export declare const transactionRoutes: import("hono/hono-base").HonoBase<{
    Variables: Variables;
}, {
    "/": {
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
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/create/:userId": {
        $post: {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: any;
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    amount: number;
                    type: "INCOME" | "EXPENSE";
                    category: string;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    userId: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                json: {
                    amount?: number | undefined;
                    type?: "INCOME" | "EXPENSE" | undefined;
                    category?: string | undefined;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    amount?: number | undefined;
                    type?: "INCOME" | "EXPENSE" | undefined;
                    category?: string | undefined;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    amount?: number | undefined;
                    type?: "INCOME" | "EXPENSE" | undefined;
                    category?: string | undefined;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    amount?: number | undefined;
                    type?: "INCOME" | "EXPENSE" | undefined;
                    category?: string | undefined;
                    date?: string | undefined;
                    description?: string | undefined;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "delete/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
}, "/", "delete/:id">;
//# sourceMappingURL=transactions.d.ts.map