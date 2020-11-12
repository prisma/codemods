import fs from "fs";
import path from "path";
import { getImportPath } from "../../utils/getImportPath";
import { runTransform } from "../../utils/runner";
import { serializer } from "./snapshotSerializer";
require('jest-specific-snapshot');
const addSerializer = require('jest-specific-snapshot').addSerializer;
addSerializer(serializer)
const TEST_OPTIONS = {
  flags: {
    dry: true,
    print: true,
    runInBand: true,
  },
  testMode: true,
};
const SNAPSHOT_DIR = path.join(__dirname, "..", "__snapshots__");
const FIXTURES_DIR = path.join(__dirname, "..", "__fixtures__");
export function buildTest(transformer: string) {
  const transformerFixtures = path.join(FIXTURES_DIR, transformer);
  const projectsDir = path.join(transformerFixtures, "projects");
  const inputsDir = path.join(transformerFixtures, "inputs");
  describe(`${transformer} inputs`, () => {
    const files = fs.readdirSync(inputsDir);
    for (const file of files) {
      test(path.basename(file), async () => {
        const filePath = path.join(inputsDir, file);
        const importPath = await getImportPath();
        process.env.PRISMA_IMPORT_PATH = importPath;
        const result = await runTransform({
          files: filePath,
          importPath,
          transformer,
          ...TEST_OPTIONS,
        });
        const snapshotFile = path.join(SNAPSHOT_DIR,transformer, 'input', file)
        // @ts-ignore
        expect(result.stdout).toMatchSpecificSnapshot(snapshotFile);
      });
    }
  });

  describe(`${transformer} projects`, () => {
    const projects = fs.readdirSync(projectsDir);
    for (const projectName of projects) {
      test(projectName, async () => {
        const projectDir = path.join(projectsDir, projectName);
        const importPath = await getImportPath(undefined, projectDir);
        process.env.PRISMA_IMPORT_PATH = importPath;
        const result = await runTransform({
          files: projectDir,
          importPath,
          transformer: transformer,
          ...TEST_OPTIONS,
        });
        const snapshotFile = path.join(SNAPSHOT_DIR,transformer,'projects', `${projectName}.ts`)
        // @ts-ignore
        expect(result.stdout).toMatchSpecificSnapshot(snapshotFile);
      });
    }
  });
}
