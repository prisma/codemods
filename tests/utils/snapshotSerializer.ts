import stripAnsi from 'strip-ansi'

export const serializer = {
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

export function cleanLogs(logs: string): string {
  const clean = stripAnsi(logs)
  return clean
}

