module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  snapshotSerializers: ['./tests/snapshotSerializer.ts'],
};
