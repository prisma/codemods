"use strict";

import child_process from "child_process";
import path from "path";
const transform = require.resolve("../dist/namespace-transform");

it("transforms correctly", () => {
  const result = child_process.spawnSync(
    path.join(__dirname, "..", "node_modules", ".bin", "jscodeshift"),
    [
      "--dry",
      "--print",
      "--run-in-band",
      "-t",
      transform,
      "--extensions=ts",
      "--parser=ts",
      path.join(__dirname, "./__fixtures__/namespace.input.ts"),
    ],
    {
      encoding: "utf8",
    }
  );
  expect(result.stdout).toMatchInlineSnapshot(`
    "import { Prisma, PrismaClient } from '@prisma/client'
    import * as fs from 'fs'
    function test(){
        const why = fs
    }
    // in the code
    const args: Prisma.UserArgs
    "
  `);
});
