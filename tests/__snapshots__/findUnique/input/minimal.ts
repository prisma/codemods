// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`findUnique inputs minimal.ts 1`] = `
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function main(){
  const user = prisma.user.findUnique({
    where: {
      id: "test"
    }
  })
}
const findOne = 'findOne'
const func = findOne()
const obj = user.findOne()

async function f(){
  let output = await this.prisma.genUser.findUnique({
    where:{}
  });
} 
`;
