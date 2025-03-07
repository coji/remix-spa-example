import type { Config } from '@react-router/dev/config'

declare module 'react-router' {
  interface Future {
    unstable_middleware: true
  }
}

export default {
  ssr: false,
  future: {
    unstable_middleware: true,
  },
} satisfies Config
