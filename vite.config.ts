import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { visualizer } from 'rollup-plugin-visualizer'
import { safeRoutes } from 'safe-routes/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { rollupOptions: { plugins: [visualizer()] } },
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    reactRouter(),
    safeRoutes(),
    tsconfigPaths(),
  ],
})
