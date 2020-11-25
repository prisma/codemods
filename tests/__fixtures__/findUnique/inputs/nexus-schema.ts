export const login = mutationField('login', {
  type: 'User',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(parent, { email, password }, context) {
    const user = await context.prisma.user.findOne({
      where: { email },
    })
    return user
  }
})