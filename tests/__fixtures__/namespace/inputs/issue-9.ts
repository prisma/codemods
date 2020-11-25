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