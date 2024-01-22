import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import remixConfig from './remix.config'

export default defineConfig({
  build: { rollupOptions: { plugins: [visualizer()] } },
  plugins: [remix({ ...remixConfig, unstable_ssr: false }), tsconfigPaths()],
})
