# Prisma Codemods

### Usage
First install:
```shell
npm install
```

Try the [namespace-transform](namespace-transform.js) transform:
```shell
./node_modules/.bin/jscodeshift -t ./dist/namespace-transform.js --extensions=ts --parser=ts ./tests/__fixtures__/namespace.input.ts --print --dry
```

_Omit `--dry` to write the transformed source back to disk._

### Test
```shell
npm test
```
