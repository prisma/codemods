import {Command, flags} from '@oclif/command'
import { buildRunner } from '../utils/runner';
import * as git from '../utils/git'

const transform =  require.resolve("../transforms/namespace");

export default class Namespace extends Command {
  static description = 'Codemod for @prisma/client namespace change'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    write: flags.boolean({char: 'w', description: 'Write to files', default: false}),
    debug: flags.boolean({char: 'd', description: 'Debug', default: false})
  }

  static args = [{name: 'dir'}]

  async run() {
    const {args, flags} = this.parse(Namespace)
    const dir = process.cwd()
    if(git.isGit(dir)){
      const result = git.status(dir)
      if(result.dirty || result.untracked){
        this.log("You have uncommitted changes. Please commit any changes before running this codemod")
      }
      else if(args.dir){
        this.log(`Performing namespace transform in files ${args.dir} ${flags.write ? '' : 'in dry mode'}`)
        const runner = buildRunner(transform)
        const result = await runner(args.dir, {debug: flags.debug, dry: !flags.write})
        console.log(result.stdout);
  
      }
    }
    
  }
}