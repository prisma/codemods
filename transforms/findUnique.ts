import { API, FileInfo, Options } from "jscodeshift";

const INSTANCE_NAME = 'prisma'

export default function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);
  let foundInstanceNames: string[] = []

  // Finds All const x = new PrismaClient() and adds x to the foundInstanceNames
  root.find(j.VariableDeclarator, {
    id: {
      type: "Identifier"
    },
    init: {
      type: "NewExpression",
      callee: {
        name: "PrismaClient"
      }
    }
  }).forEach((vd: any) => {
    if(vd.node.id?.name){
      foundInstanceNames.push(vd.node.id?.name)
    }
  });
  const instanceNames = getInstanceNames(foundInstanceNames, options?.instanceNames) // If custom instance names are passed to the cli these are used

  root.find(j.Identifier, {
    name: 'findOne'
  }).filter((idPath) => {
      // This finds prisma.x.findOne
      if (
        instanceNames.includes(idPath?.parent?.value?.object?.object?.name) ||
        instanceNames.includes(idPath?.parent?.value?.object?.object?.property?.name)
      ) {
        return true;
      }
      return false;
    })
    .replaceWith((p) =>
      Object.assign({}, p.node, {
        name: `findUnique`,
      })
    );
  return root.toSource();
}

function getInstanceNames(foundInstanceNames: string[], cli?: string): string[]{
  if(cli){
    const fromCli = cli.split(',').map(i => i.trim())
    if(fromCli.length > 0){
      console.log(`Only searching for passed instance names: ${cli}`);
      return fromCli
    }
  }
  return foundInstanceNames.length > 0 ? foundInstanceNames : [INSTANCE_NAME]
}