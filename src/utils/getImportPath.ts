import { getGenerators, getRelativeSchemaPath } from '@prisma/sdk'
import path from 'path';

export async function getImportPath(cwd: string){
  const schemaPath = await getRelativeSchemaPath(cwd)
  console.log({schemaPath});
  if(schemaPath){
    const generators = await getGenerators({schemaPath})
    const generator = generators[0]
    if(generator){
      const isCustom = generator.options?.generator?.isCustomOutput
      const customImportPath = path.relative(cwd, generator.options?.generator.output!)
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
