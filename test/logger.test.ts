import { expect, test } from 'bun:test'
import { createConsoleLogger, DEFAULT_GZIP_MIME_TYPES, type Logger } from '../src/index.ts'

const customLogger: Logger = {
  debug() {},
  error() {},
  info() {},
}
const consoleLogger: Logger = createConsoleLogger()

test('Logger accepts structural and console implementations', () => {
  customLogger.info('custom logger is assignable')
  consoleLogger.info('console logger is assignable')

  expect(typeof customLogger.info).toBe('function')
  expect(typeof consoleLogger.info).toBe('function')
})

test('createConsoleLogger prefixes debug, error, and info output', () => {
  const calls: Array<{ args: unknown[]; method: 'error' | 'log' }> = []
  const originalConsoleError = console.error
  const originalConsoleLog = console.log
  const logger = createConsoleLogger()

  console.log = (...args: unknown[]) => {
    calls.push({
      args,
      method: 'log',
    })
  }
  console.error = (...args: unknown[]) => {
    calls.push({
      args,
      method: 'error',
    })
  }

  try {
    logger.debug('debug message', 1)
    logger.error('error message', 2)
    logger.info('info message', 3)
  } finally {
    console.error = originalConsoleError
    console.log = originalConsoleLog
  }

  expect(calls).toEqual([
    {
      args: ['DBG', 'debug message', 1],
      method: 'log',
    },
    {
      args: ['ERR', 'error message', 2],
      method: 'error',
    },
    {
      args: ['INF', 'info message', 3],
      method: 'log',
    },
  ])
})

test('DEFAULT_GZIP_MIME_TYPES is exported for composition', () => {
  expect(DEFAULT_GZIP_MIME_TYPES).toEqual([
    'application/javascript',
    'application/json',
    'application/xml',
    'image/svg+xml',
    'text/',
  ])
})
