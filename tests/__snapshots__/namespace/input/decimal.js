// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`namespace inputs decimal.js 1`] = `
import { PrismaClient, Prisma } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient()

  const a = await prisma.a.findFirst()
  const b = await prisma.b.findFirst({
    where: {
      decFloat: new Prisma.Decimal('1.23')
    }
  })
  const c = await prisma.c.findFirst()
  const d = await prisma.d.findFirst()
  const e = await prisma.e.findFirst()

}

main()

`;
