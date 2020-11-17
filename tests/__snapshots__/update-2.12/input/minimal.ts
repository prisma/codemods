// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`update-2.12 inputs minimal.ts 1`] = `
import { PrismaClient, Prisma } from '@prisma/client'

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
    const args: Prisma.UserArgs;
}
// in the code

import { PrismaClient, UserArgs } from '@prisma/client'

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

function test(){
    const args: UserArgs;
}
// in the code

`;
