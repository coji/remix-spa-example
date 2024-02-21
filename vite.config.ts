import mdx from '@mdx-js/rollup'
import { vitePlugin as remix } from '@remix-run/dev'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { flatRoutes } from 'remix-flat-routes'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { rollupOptions: { plugins: [visualizer()] } },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({
      ignoredRouteFiles: ['**/*'],
      routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
      ssr: false,
    }),
    tsconfigPaths(),
  ],
})
