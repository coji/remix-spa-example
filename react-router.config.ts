import type { Config } from '@react-router/dev/config'

export default {
  ssr: false,
  future: {
    v8_middleware: true,
    unstable_optimizeDeps: true,
  },
} satisfies Config
