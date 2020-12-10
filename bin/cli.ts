/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Based on https://github.com/reactjs/react-codemod/blob/dd8671c9a470a2c342b221ec903c574cf31e9f57/bin/cli.js
// @next/codemod optional-name-of-transform optional/path/to/src [...options]

import chalk from "chalk";
import globby from "globby";
import inquirer from "inquirer";
// @ts-ignore
import isGitClean from "is-git-clean";
import meow from "meow";
import { getCustomImportPath } from "../utils/getCustomImportPath";
import {
  jscodeshiftExecutable,
  runTransform,
  transformerDirectory,
} from "../utils/runner";

function checkGitStatus(force?: boolean) {
  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";
  try {
    clean = isGitClean.sync(process.cwd());
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf("Not a git repository") >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else {
      console.log("Thank you for using @prisma/codemods!");
      console.log(
        chalk.yellow(
          "\nBut before we continue, please stash or commit your git changes."
        )
      );
      console.log(
        "\nYou may use the --force flag to override this safety check."
      );
      process.exit(1);
    }
  }
}

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: "update-2.12: Runs namespace/findUnique/to$ transforms",
    value: "update-2.12",
  },
  {
    name: "namespace: Codemod for @prisma/client namespace change",
    value: "namespace",
  },
  {
    name: "to$: Converts deprecated prisma.x methods to prisma.$x",
    value: "to$",
  },
  {
    name: "findUnique: Codemod for @prisma/client that converts findOne to findUnique",
    value: "findUnique",
  },
];


function run() {
  const cli = meow(
    `
  Usage
    $ npx @prisma/codemods <transform> <path> <...options>
      transform    One of the choices from https://github.com/prisma/codemods#transforms
      path         Directory of your app. i.e ./my-awesome-project
  Options
    --force            Bypass Git safety checks and forcibly run codemods
    --schemaPath       Specify a path to your ./prisma/schema.prisma
    --dry              Dry run (no changes are made to files)
    --print            Print transformed files to your terminal
`,
    {
      autoHelp: true,
      flags: {
        schemaPath: {
          type: "string",
          isRequired: false,
        },
        force: {
          alias: "f",
          type: "boolean",
        },
        dry: {
          alias: "d",
          type: "boolean",
        },
        print: {
          alias: "p",
          type: "boolean",
        },
        runInBand: {
          type: "boolean",
        },
        help: {
          alias: "h",
          type: "boolean",
        },
      },
    }
  );

  if (!cli.flags.dry) {
    checkGitStatus(cli.flags.force);
  }

  if (
    cli.input[0] &&
    !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[0])
  ) {
    console.error("Invalid transform choice, pick one of:");
    console.error(
      TRANSFORMER_INQUIRER_CHOICES.map((x) => "- " + x.value).join("\n")
    );
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        type: "input",
        name: "dir",
        message: "On which directory should the codemods be applied?",
        when: !cli.input[1],
        default: ".",
        // validate: () =>
        filter: (files) => files.trim(),
      },
      {
        type: "list",
        name: "transformer",
        message: "Which transform would you like to apply?",
        when: !cli.input[0],
        pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
        choices: TRANSFORMER_INQUIRER_CHOICES,
      },
    ])
    .then(async (answers) => {
      const { dir, transformer } = answers;

      const dirPath = cli.input[1] || dir;

      const selectedTransformer = cli.input[0] || transformer;

      process.env.PRISMA_CUSTOM_IMPORT_PATH = await getCustomImportPath({
        schemaPathFromArgs: cli.flags.schemaPath,
        cwd: dirPath,
      });
      if(selectedTransformer === 'update-2.12'){
        const namespace = await runTransform({
          projectDir: dirPath,
          flags: cli.flags,
          customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
          transformer: 'namespace',
        });
        const findUnique = await runTransform({
          projectDir: dirPath,
          flags: cli.flags,
          customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
          transformer: 'findUnique',
        });
        const to$ = await runTransform({
          projectDir: dirPath,
          flags: cli.flags,
          customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
          transformer: 'to$',
        });
      } else {
        return runTransform({
          projectDir: dirPath,
          flags: cli.flags,
          customImportPath: process.env.PRISMA_CUSTOM_IMPORT_PATH,
          transformer: selectedTransformer,
        });
      }
    });
}

module.exports = {
  run: run,
  runTransform: runTransform,
  checkGitStatus: checkGitStatus,
  jscodeshiftExecutable: jscodeshiftExecutable,
  transformerDirectory: transformerDirectory,
};
