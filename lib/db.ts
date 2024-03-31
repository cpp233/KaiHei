import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // var prismaGlobal: PrismaClient | undefined; // 全局变量

  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Best practice
// globalThis不受 hotReload 影响
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
export const db = globalThis.prismaGlobal || new PrismaClient();

// export default db;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}
