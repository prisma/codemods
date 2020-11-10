import path from "path";
import fs from 'fs';

import { buildRunner, Options } from "../src/utils/runner";
import { getImportPath } from "../src/utils/getImportPath"
const transform = require.resolve("../lib/transforms/namespace");
const testRunner = buildRunner(transform)
const options: Options = {dry: true, debug: false, print: true, runInBand: true}

describe('inputs', () => {
  const inputsDir = path.join(__dirname, "./__fixtures__/inputs")
  const files = fs.readdirSync(inputsDir)
  for (const file of files) {
    test(path.basename(file), async () => {
      const filePath = path.join(inputsDir, file);
      const importPath = await getImportPath()
      process.env.PRISMA_IMPORT_PATH = importPath
      const result = await testRunner(filePath, options)
      expect(result.stdout).toMatchSnapshot();
    });
  }
})

describe('projects', () => {
  const inputsDir = path.join(__dirname, "./__fixtures__/projects")

  const projects = fs.readdirSync(inputsDir)

  for (const projectName of projects) {
    test(projectName, async () => {
      const projectDir = path.join(inputsDir,projectName)
      const importPath = await getImportPath(undefined, projectDir)
      process.env.PRISMA_IMPORT_PATH = importPath
      const result = await testRunner(projectDir, options)
      expect(result.stdout).toMatchSnapshot();
    });
  }
})
