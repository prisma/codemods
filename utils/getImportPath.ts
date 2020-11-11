import { getGenerators } from '@prisma/sdk'
import { getSchemaPathInternal } from '@prisma/sdk/dist/cli/getSchema';
import path from 'path';

export async function getImportPath(schemaPathFromArgs?: string, cwd?: string){
  if(!cwd){
    return '@prisma/client'
  }
  const schemaPath = await getSchemaPathInternal(schemaPathFromArgs, {cwd})
  // console.log({schemaPath});
  if(schemaPath){
    const generators = await getGenerators({schemaPath})
    const generator = generators[0]
    if(generator){
      const isCustom = generator.options?.generator?.isCustomOutput
      const customImportPath = path.relative(cwd, generator.options?.generator.output!)
      generator.stop()
      return isCustom ? customImportPath : '@prisma/client'
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
