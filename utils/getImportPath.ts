import { getConfig, getGenerators } from '@prisma/sdk'
import { getSchemaPathInternal } from '@prisma/sdk/dist/cli/getSchema';
import path from 'path';
import fs from 'fs'
export async function getImportPath(schemaPathFromArgs?: string, cwd?: string){
  if(!cwd){
    return '@prisma/client'
  }
  const schemaPath = await getSchemaPathInternal(schemaPathFromArgs, {cwd})
  const datamodel = schemaPath && fs.readFileSync(schemaPath, {encoding: 'utf8'})
  if(schemaPath){
    const config = await getConfig({datamodel, ignoreEnvVarErrors: true})
    const generator = config.generators[0]

    if(generator){
      const isCustom = generator?.output
      const customImportPath = isCustom && path.relative(cwd, generator.output)
      return isCustom ? customImportPath.replace(/\.\.\//g, '') : '@prisma/client'
    }
  }
  return '@prisma/client'
}

function prefixRelativePathIfNecessary(relativePath: string): string {
  if (relativePath.startsWith('..')) {
    return relativePath
  }

  return `./${relativePath}`
}
