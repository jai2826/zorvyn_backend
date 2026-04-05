import { verify } from 'hono/jwt';
import { prisma } from '../lib/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
export const authenticate = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        const user = await prisma.user.findUnique({
            where: { id: payload.id }
        });
        if (!user || !user.isActive) {
            return c.json({ error: 'User not found or inactive' }, 403);
        }
        c.set('user', user);
        await next();
    }
    catch (err) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
};
// RBAC Wrapper: Uses the user set by authenticate
export const authorize = (allowedRoles) => {
    return async (c, next) => {
        const user = c.get('user');
        if (!allowedRoles.includes(user.role)) {
            return c.json({ error: 'Forbidden: Insufficient permissions' }, 403);
        }
        await next();
    };
};
//# sourceMappingURL=auth.js.map