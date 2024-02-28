import {PrismaClient} from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient(); // 为了在开发环境中使用全局变量，避免热更新时重复创建实例

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;