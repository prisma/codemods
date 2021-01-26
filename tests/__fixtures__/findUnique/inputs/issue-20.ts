import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();
const anotherOne = new PrismaClient();

client.x.findOne({ where: { id: 'test' } });
anotherOne.x.findOne({ where: { id: 'test' } });