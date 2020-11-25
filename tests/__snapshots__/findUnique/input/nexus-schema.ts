// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`findUnique inputs nexus-schema.ts 1`] = `
export const login = mutationField('login', {
  type: 'User',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(parent, { email, password }, context) {
    const user = await context.prisma.user.findUnique({
      where: { email },
    })
    return user
  }
})
`;
