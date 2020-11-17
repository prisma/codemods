// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`namespace inputs keyof.ts 1`] = `
import { PrismaClient, Prisma } from '@prisma/client';
type X = Required<Prisma.UserArgs>
type Y = {
  hello: Prisma.UserArgs
}
type Z = {
  [T in keyof Prisma.UserArgs]: Prisma.UserArgs[T]
}[keyof Prisma.UserArgs]

function a(a: Prisma.UserArgs): Prisma.UserArgs {
  return null as any
}
function b<T extends Prisma.UserArgs>() {
}
async function main() {
  const prisma = new PrismaClient()
  await prisma.user.update({
    where: {
    },
    data: {
      posts: {
      }
    }
  })
  prisma.$disconnect()
}
main()

`;
