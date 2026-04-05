import type { User } from "../../prisma/generated/prisma/client";

export type Variables = {
  user: User;
};

export type { User, Transaction, Role } from '../../prisma/generated/prisma/client'