import { getConfig, getGenerators } from '@prisma/sdk'
import { getSchemaPathInternal } from '@prisma/sdk/dist/cli/getSchema';
import path from 'path';
import fs from 'fs'

interface Options {
  schemaPathFromArgs?: string, 
  cwd?: string
}
export async function getCustomImportPath(options?: Options){
  if(!options?.cwd){
    return null
  }
  const schemaPath = await getSchemaPathInternal(options?.schemaPathFromArgs, {cwd: options.cwd})
  const datamodel = schemaPath && fs.readFileSync(schemaPath, {encoding: 'utf8'})
  if(schemaPath){
    const config = await getConfig({datamodel, ignoreEnvVarErrors: true})
    const generator = config.generators[0]

    if(generator){
      const isCustom = generator?.output
      const customImportPath = isCustom && path.relative(options.cwd, generator.output)
      return isCustom ? customImportPath.replace(/\.\.\//g, '') : null
    }
  }
  return null
}
