// global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prismaGlobal: PrismaClient;
    }
  }
}

// Prevent TypeScript from compiling this file
export {};
