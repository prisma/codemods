import { Person as LocalPerson } from "./local-file";
import { Person } from "@prisma/client";

/** @type {Person} */
const person = new LocalPerson();

console.log(person);
