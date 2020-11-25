// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`namespace inputs issue-9.ts 1`] = `
// this one
import { PrismaClient, Prisma as PrismaTypes } from "@prisma/client";
// will be 

// and 

class Prisma extends PrismaClient {
  constructor(options?: PrismaTypes.PrismaClientOptions) {
    super(options);
  }

  async onDelete(args: onDeleteArgs) {
    const prismaDelete = new PrismaDelete(this);
    await prismaDelete.onDelete(args);
  }
}
`;
