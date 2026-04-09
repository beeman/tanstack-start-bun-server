# `tanstack-start-bun-server`

Bun-only helpers for serving a TanStack Start production build with:

- a loaded `server/server.js` handler
- static asset routes from `client/**/*`
- in-memory preloading for small assets
- on-demand disk reads for filtered or oversized assets
- optional ETag and gzip support

## Install

```sh
bun add tanstack-start-bun-server
```

## Basic usage

```ts
import { createTanStackStartBunServeConfig } from 'tanstack-start-bun-server'

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  webDistPath: './dist',
})

const server = Bun.serve({
  port: 3000,
  routes: {
    ...routes,
    '/*': (request) => fetchHandler(request),
  },
})

console.log(server.url)
```

## Use the default console logger explicitly

```ts
import { createConsoleLogger, createTanStackStartBunServeConfig } from 'tanstack-start-bun-server'

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  logger: createConsoleLogger(),
  webDistPath: './dist',
})
```

## Use a custom logger

```ts
import { createTanStackStartBunServeConfig, type Logger } from 'tanstack-start-bun-server'

const logger: Logger = {
  debug(message, ...args) {
    console.debug(message, ...args)
  },
  error(message, ...args) {
    console.error(message, ...args)
  },
  info(message, ...args) {
    console.info(message, ...args)
  },
}

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  logger,
  maxPreloadBytes: 5 * 1024 * 1024,
  webDistPath: './dist',
})
```

## Customize gzip mime types

```ts
import { DEFAULT_GZIP_MIME_TYPES, createTanStackStartBunServeConfig } from 'tanstack-start-bun-server'

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  gzipMimeTypes: [...DEFAULT_GZIP_MIME_TYPES, 'application/wasm'].sort(),
  webDistPath: './dist',
})
```

```ts
import { DEFAULT_GZIP_MIME_TYPES, createTanStackStartBunServeConfig } from 'tanstack-start-bun-server'

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  gzipMimeTypes: DEFAULT_GZIP_MIME_TYPES.filter((type) => type !== 'image/svg+xml'),
  webDistPath: './dist',
})
```

## Use alongside application routes

```ts
import { createTanStackStartBunServeConfig } from 'tanstack-start-bun-server'

const app = {
  fetch(request: Request) {
    return new Response(`api:${new URL(request.url).pathname}`)
  },
}

const { fetchHandler, routes } = await createTanStackStartBunServeConfig({
  includePatterns: ['*.css', '*.js', '*.woff2'],
  webDistPath: './dist',
})

Bun.serve({
  port: 3000,
  routes: {
    '/api': (request) => app.fetch(request),
    '/api/*': (request) => app.fetch(request),
    ...routes,
    '/*': (request) => fetchHandler(request),
  },
})
```

## Development

```sh
bun run build
bun run check-types
bun run lint
bun run lint:fix
bun test
bun run test:watch
```

## Publishing

```sh
bun run changeset
bun run version
bun run release
```

## License

MIT; see [LICENSE](./LICENSE).
