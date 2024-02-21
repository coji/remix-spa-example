import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

startTransition(() => {
  hydrateRoot(
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    document.querySelector('#app')!,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  )
})
