"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Namespace extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(Namespace);
        this.log(`hello from /root/cli/tmp/examples/example-multi-ts/src/commands/goodbye.ts`);
        // if (args.file && flags.force) {
        //   this.log(`you input --force and --file: ${args.file}`)
        // }
    }
}
exports.default = Namespace;
Namespace.description = 'Codemod from namespace change';
Namespace.flags = {
    help: command_1.flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f' }),
};
Namespace.args = [{ name: 'file' }];
