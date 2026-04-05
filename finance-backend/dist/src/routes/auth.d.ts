export declare const authRoutes: import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, {
    "/register": {
        $post: {
            input: {
                json: {
                    email: string;
                    password: string;
                };
            };
            output: any;
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    email: string;
                    password: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 400;
        };
    };
} & {
    "/login": {
        $post: {
            input: {
                json: {
                    email: string;
                    password: string;
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
                    email: string;
                    password: string;
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
                    email: string;
                    password: string;
                };
            };
            output: {
                token: string;
                user: any;
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/", "/login">;
//# sourceMappingURL=auth.d.ts.map