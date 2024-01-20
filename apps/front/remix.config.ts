import type { AppConfig } from '@remix-run/dev'
import { flatRoutes } from 'remix-flat-routes'

export default {
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
  watchPaths: ['tailwind.config.js'],
} satisfies AppConfig
