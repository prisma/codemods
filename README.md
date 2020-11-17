# Prisma Codemods

A collection of codemods for prisma

## Usage

```shell
$ npx @prisma/codemods <transform> <path> <...options>
```

```shell
  transform    One of the choices from https://github.com/prisma/codemods/#transforms
  path         Files or directory to your app. e.g ./my-awesome-project
```

```shell
Options
  -(-f)orce         Bypass Git safety checks and forcibly run codemods
  -(-d)ry           Dry run (no changes are made to files)
  -(-p)rint         Print transformed files to your terminal
```

### Transforms

| \<transform>  | Description                                          | Example                                                |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| `namespace`   | Codemod for `@prisma/client` namespace change        | `npx @prisma/codemods namespace ./my-project`  |
| `findUnique`  | Converts `prisma.x.findOne` to `prisma.x.findUnique` | `npx @prisma/codemods findUnique ./my-project` |
| `update-2.12` | Includes `namespace` & `findUnique`                  | `npx @prisma/codemods update-2.12 ./my-project` |

## Development

```shell
git clone https://github.com/prisma/codemods.git
cd codemods
yarn && yarn watch
```

In a separate terminal you can then run

```shell
yarn cli --help
```

### Testing

```shell
yarn test
```
