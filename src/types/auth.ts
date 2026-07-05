import { DefaultSession } from "next-auth";
import type { userRoleEnum } from "@/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
