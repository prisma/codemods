import { PrismaClient, UserArgs } from '@prisma/client'

const prisma = new PrismaClient()

function main(){
  const user = prisma.user.findOne({
    where: {
      id: "test"
    }
  })
}
const findOne = 'findOne'
const func = findOne()
const obj = user.findOne()

function test(){
    const args: UserArgs;
}
// in the code