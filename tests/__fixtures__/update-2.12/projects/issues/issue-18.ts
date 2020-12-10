import { Person } from "@prisma/client";

const person = {where: {
  Person: { id: personId },
  expiresAt: { gt: new Date() }
},
}
console.log(person);
