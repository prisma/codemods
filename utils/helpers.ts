export function isPrismaImport(importPath: string) {
  const prismaPaths = [".prisma/client", "@prisma/client"];
  if (process.env.PRISMA_CUSTOM_IMPORT_PATH) {
    prismaPaths.push(process.env.PRISMA_CUSTOM_IMPORT_PATH);
  }
  return prismaPaths.some((p) => {
    return importPath.includes(p);
  });
}