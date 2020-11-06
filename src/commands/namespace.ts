import {Command, flags} from '@oclif/command'

export default class Namespace extends Command {
  static description = 'Codemod from namespace change'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Namespace)

    this.log(`hello from /root/cli/tmp/examples/example-multi-ts/src/commands/goodbye.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}