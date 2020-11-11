import stripAnsi from 'strip-ansi'

const serializer = {
  test(value: any) {
    return typeof value === 'string' || value instanceof Error
  },
  serialize(value: any) {
    if (typeof value === 'string') {
      return cleanLogs(value)
    }
    return value.toString()
  },
}

function cleanLogs(logs: string): string {
  const clean = stripAnsi(logs)

  return clean.split('\n').slice(2, -8).join('\n')
}

module.exports = serializer
