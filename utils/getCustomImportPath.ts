import { getConfig, getDMMF } from '@prisma/sdk'
import { getSchemaPathInternal } from '@prisma/sdk/dist/cli/getSchema';
import path from 'path';
import fs from 'fs'
import tempy from 'tempy';

interface Options {
  schemaPathFromArgs?: string, 
  cwd?: string
}
export async function getCustomImportPath(options?: Options){
  if(!options?.cwd){
    return ''
  }
  const schemaPath = await getSchemaPathInternal(options?.schemaPathFromArgs, {cwd: options.cwd})
  const datamodel = schemaPath && fs.readFileSync(schemaPath, {encoding: 'utf8'})
  if(schemaPath){
    const config = await getConfig({datamodel, ignoreEnvVarErrors: true})
    process.env.PRISMA_TOP_LEVEL_EXPORTS_FILE = await getTopLevelExports(datamodel)
    const generator = config.generators[0]
    
    if(generator){
      const isCustom = generator?.output
      const customImportPath = isCustom && path.relative(options.cwd, generator.output)
      return isCustom ? customImportPath.replace(/\.\.\//g, '') : ''
    }
  }
  return ''
}
function getModelNames(model: {name: string}[]){
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
