"use strict";
/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Based on https://github.com/reactjs/react-codemod/blob/dd8671c9a470a2c342b221ec903c574cf31e9f57/bin/cli.js
// @next/codemod optional-name-of-transform optional/path/to/src [...options]
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const globby_1 = __importDefault(require("globby"));
const inquirer_1 = __importDefault(require("inquirer"));
const is_git_clean_1 = __importDefault(require("is-git-clean"));
const meow_1 = __importDefault(require("meow"));
const path_1 = __importDefault(require("path"));
const getImportPath_1 = require("../utils/getImportPath");
const transformerDirectory = path_1.default.join(__dirname, "../", "transforms");
const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");
function checkGitStatus(force) {
    let clean = false;
    let errorMessage = "Unable to determine if git directory is clean";
    try {
        clean = is_git_clean_1.default.sync(process.cwd());
        errorMessage = "Git directory is not clean";
    }
    catch (err) {
        if (err && err.stderr && err.stderr.indexOf("Not a git repository") >= 0) {
            clean = true;
        }
    }
    if (!clean) {
        if (force) {
            console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
        }
        else {
            console.log("Thank you for using @prisma/codemods!");
            console.log(chalk_1.default.yellow("\nBut before we continue, please stash or commit your git changes."));
            console.log("\nYou may use the --force flag to override this safety check.");
            process.exit(1);
        }
    }
}
function runTransform({ files, flags, transformer, importPath }) {
    const transformerPath = path_1.default.join(transformerDirectory, `${transformer}.js`);
    let args = [];
    const { dry, print } = flags;
    if (dry) {
        args.push("--dry");
    }
    if (print) {
        args.push("--print");
    }
    args.push("--verbose=2");
    args.push("--ignore-pattern=**/node_modules/**");
    args.push(`--ignore-pattern=**/${importPath}/**`);
    // TODO Check TSX parser
    args.push("--extensions=ts,js");
    args.push("--parser=ts");
    args = args.concat(["--transform", transformerPath]);
    if (flags.jscodeshift) {
        args = args.concat(flags.jscodeshift);
    }
    args = args.concat(files);
    console.log(`Executing command: jscodeshift ${args.join(" ")}`);
    const result = execa_1.default.sync(jscodeshiftExecutable, args, {
        stdio: "inherit",
        stripFinalNewline: false,
    });
    if (result.stderr) {
        throw result.stderr;
    }
}
const TRANSFORMER_INQUIRER_CHOICES = [
    {
        name: "namespace: Codemod for @prisma/client namespace change",
        value: "namespace",
    },
];
function expandFilePathsIfNeeded(filesBeforeExpansion) {
    const shouldExpandFiles = filesBeforeExpansion.some((file) => file.includes("*"));
    return shouldExpandFiles
        ? globby_1.default.sync(filesBeforeExpansion)
        : filesBeforeExpansion;
}
function run() {
    const cli = meow_1.default(`
  Usage
    $ npx @prisma/codemods <transform> <path> <...options>
      transform    One of the choices from https://github.com/prisma/codemods/tree/main
      path         Files or directory to your app. Can be a glob like src/**.ts
  Options
    --force            Bypass Git safety checks and forcibly run codemods
    --dry              Dry run (no changes are made to files)
    --print            Print transformed files to your terminal
`, {
        autoHelp: true,
        flags: {
            schemaPath: {
                type: "string",
                isRequired: false
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
            help: {
                alias: "h",
                type: "boolean",
            },
        },
    });
    if (!cli.flags.dry) {
        checkGitStatus(cli.flags.force);
    }
    if (cli.input[0] &&
        !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[0])) {
        console.error("Invalid transform choice, pick one of:");
        console.error(TRANSFORMER_INQUIRER_CHOICES.map((x) => "- " + x.value).join("\n"));
        process.exit(1);
    }
    inquirer_1.default
        .prompt([
        {
            type: "input",
            name: "files",
            message: "On which files or directory should the codemods be applied?",
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
        .then((answers) => __awaiter(this, void 0, void 0, function* () {
        const { files, transformer } = answers;
        const filesBeforeExpansion = cli.input[1] || files;
        const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);
        const selectedTransformer = cli.input[0] || transformer;
        if (!filesExpanded.length) {
            console.log(`No files found matching ${filesBeforeExpansion.join(" ")}`);
            return null;
        }
        const importPath = yield getImportPath_1.getImportPath(cli.flags.schemaPath, cli.input[1]);
        process.env.PRISMA_IMPORT_PATH = importPath;
        return runTransform({
            files: filesExpanded,
            flags: cli.flags,
            importPath: importPath,
            transformer: selectedTransformer,
        });
    }));
}
module.exports = {
    run: run,
    runTransform: runTransform,
    checkGitStatus: checkGitStatus,
    jscodeshiftExecutable: jscodeshiftExecutable,
    transformerDirectory: transformerDirectory,
};
//# sourceMappingURL=cli.js.map