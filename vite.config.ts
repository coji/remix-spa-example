import { reactRouter } from '@react-router/dev/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { rollupOptions: { plugins: [visualizer()] } },
  plugins: [reactRouter(), tsconfigPaths()],
})
