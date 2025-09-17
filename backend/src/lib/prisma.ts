import { PrismaClient } from '@prisma/client';

export const createPrismaClient = (databaseUrl: string) => {
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  });
};
