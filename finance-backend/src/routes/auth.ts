import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";


const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export const authRoutes = new Hono()
  
  .post("/register", zValidator("json", authSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "VIEWER", 
        },
      });

      return c.json({ message: "User created", userId: user.id }, 201);
    } catch (e) {
      return c.json({ error: "Email already exists" }, 400);
    }
  })

  
  .post("/login", zValidator("json", authSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return c.json({ error: "Invalid credentials" }, 401);
    } 

    if(user.isActive === false) {
      return c.json({ error: "Account is deactivated. Please contact support." }, 403);
    }

    const token = await sign(
      { 
        id: user.id, 
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 
      },
      JWT_SECRET
    );

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    }, 200); 
  });