import { Command, flags } from "@oclif/command";
import { getImportPath } from '../utils/getImportPath';
import * as git from "../utils/git";
import { buildRunner } from "../utils/runner";

const transform = require.resolve("../transforms/namespace");

export default class Namespace extends Command {
  static description = "Codemod for @prisma/client namespace change";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    write: flags.boolean({
      char: "w",
      description: "Write to files",
      default: false,
    }),
    debug: flags.boolean({ char: "d", description: "Debug", default: false }),
  };

  static args = [{ name: "dir" }];

  async run() {
    const { args, flags } = this.parse(Namespace);
    const dir = process.cwd();
    if (git.isGit(dir)) {
      const result = git.status(dir);
      if (args.dir) {
        this.log(
          `Performing namespace transform on files in ${args.dir} ${
            flags.write ? "" : "in dry mode"
          }`
        );
        const importPath = await getImportPath(args.dir)
        process.env.PRISMA_IMPORT_PATH = importPath
        const runner = buildRunner(transform);
        const result = await runner(args.dir, {
          debug: flags.debug,
          dry: !flags.write,
        });
        console.log(result.stdout);
        console.log(result.stderr);
      }
    }
  }
}
