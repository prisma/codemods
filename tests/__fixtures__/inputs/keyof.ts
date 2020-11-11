import { PrismaClient, AggregatePost, UserArgs } from '@prisma/client'
type X = Required<UserArgs>
type Y = {
  hello: UserArgs
}
type Z = {
  [T in keyof UserArgs]: UserArgs[T]
}[keyof UserArgs]

function a(a: UserArgs): UserArgs {
  return null as any
}
function b<T extends UserArgs>() {
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