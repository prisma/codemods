import { PrismaClient } from '@prisma/client'

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

async function f(){
  let output = await this.prisma.genUser.findOne({
    where:{}
  });
} 