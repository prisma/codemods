import fs from "fs";
import { addSerializer } from "jest-specific-snapshot";
import path from "path";
import { getCustomImportPath } from "../../utils/getCustomImportPath";
import { runTransform } from "../../utils/runner";
import { serializer } from "./snapshotSerializer";
import("jest-specific-snapshot");
addSerializer(serializer);
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
  if (fs.existsSync(inputsDir)) {
    describe(`${transformer} inputs`, () => {
      const files = fs.readdirSync(inputsDir);
      for (const file of files) {
        test(path.basename(file), async () => {
          const filePath = path.join(inputsDir, file);
          process.env.PRISMA_CUSTOM_IMPORT_PATH = await getCustomImportPath();
          const result = await runTransform({
            files: filePath,
            customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
            transformer,
            ...TEST_OPTIONS,
          });
          const snapshotFile = path.join(
            SNAPSHOT_DIR,
            transformer,
            "input",
            file
          );
          // @ts-ignore
          expect(result.stdout).toMatchSpecificSnapshot(snapshotFile);
        });
      }
    });
  }
  if (fs.existsSync(projectsDir)) {
    describe(`${transformer} projects`, () => {
      const projects = fs.readdirSync(projectsDir);
      for (const projectName of projects) {
        test(projectName, async () => {
          const projectDir = path.join(projectsDir, projectName);
          process.env.PRISMA_CUSTOM_IMPORT_PATH = await getCustomImportPath({
            cwd: projectDir,
          });
          const result = await runTransform({
            files: projectDir,
            customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
            transformer: transformer,
            ...TEST_OPTIONS,
          });
          const snapshotFile = path.join(
            SNAPSHOT_DIR,
            transformer,
            "projects",
            `${projectName}.ts`
          );
          // @ts-ignore
          expect(result.stdout).toMatchSpecificSnapshot(snapshotFile);
        });
      }
    });
  }
}
