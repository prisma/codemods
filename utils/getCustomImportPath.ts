import { getConfig, getDMMF } from '@prisma/sdk'
import { getSchemaPathInternal } from '@prisma/sdk/dist/cli/getSchema';
import path from 'path';
import fs from 'fs'
import tempy from 'tempy';

interface Options {
  schemaPathFromArgs?: string, 
  cwd: string
}
export async function getCustomImportPath(options: Options){

  const schemaPath = await getSchemaPathInternal(options?.schemaPathFromArgs, {cwd: options.cwd})
  if(!schemaPath || !fs.existsSync(schemaPath)){
    throw new Error("Prisma Schema Could Not be found, try specifying the `--schemaPath ./path/to/schema.prisma`")
  }
  const datamodel = schemaPath && fs.readFileSync(schemaPath, {encoding: 'utf8'})
  if(datamodel){
    const config = await getConfig({datamodel, ignoreEnvVarErrors: true})
    process.env.PRISMA_TOP_LEVEL_EXPORTS_FILE = await getTopLevelExports(datamodel)
    const generator = config.generators[0]
    
    if(generator){
      return generator?.output ? generator.output.replace(/\.\.\//g, '') : ''
    }
  }
  return ''
}
function getModelNames<T extends {name: string}>(model?: T[]){
  return model ? model.map(it => it.name): []
}
export async function getTopLevelExports(datamodel: string){
  const dmmf = await getDMMF({datamodel})
  const schema = dmmf.schema
  const inputs = getModelNames(schema.inputObjectTypes.model)
  const outputs = getModelNames(schema.outputObjectTypes.model)
  const enums = getModelNames(schema.enumTypes.model)
  const expts = [...inputs, ...outputs, ...enums].filter((v, i, a) => a.indexOf(v) === i);
  const filePath = tempy.writeSync(expts.join(','))
  return filePath
}
