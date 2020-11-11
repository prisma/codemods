# Prisma Codemods

## Usage

```shell
  A collection of codemods for prisma

  Usage
    $ npx @prisma/codemods <transform> <path> <...options>
      transform    One of the choices from https://github.com/prisma/codemods/tree/main
      path         Files or directory to your app. e.g ./src/
  Options
    --force   (-f)         Bypass Git safety checks and forcibly run codemods
    --dry     (-d)         Dry run (no changes are made to files)
    --print   (-p)         Print transformed files to your terminal
```

### Transforms

| transform   | description                            | example |
| ----------- | -------------------------------------- | ------- |
| `namespace` | Codemod for `@prisma/client` namespace | `npx @prisma/codemods namespace ./src`  |

## Development

```shell
git clone https://github.com/prisma/codemods.git
cd codemods
yarn && yarn watch
```
In a separate terminal you can then run
```shell
node ./bin/prisma-codemod.js namespace ./tests/__fixtures__/projects/minimal/ -f -d -p
```

### Testing

```shell
yarn test
```
