import { prisma } from "@/lib/prisma";

const globalForPrisma = globalThis as unknown as { prismaAuth: PrismaClient };

// Gunakan 'prismaAuth' biar gak bentrok variable globalnya
export const prismaAuth = globalForPrisma.prismaAuth || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaAuth = prismaAuth;
