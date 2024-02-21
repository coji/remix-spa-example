import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Toaster } from '~/components/ui'
import { AuthContext, useAuthStateObserve } from './services/auth'
import './styles/globals.css'

export const meta = () => {
  return [{ title: 'しずかな Remix SPA Example' }]
}

export default function App() {
  const { authState } = useAuthStateObserve()
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthContext.Provider value={authState}>
          <Toaster />
          <Outlet />
        </AuthContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="grid h-screen grid-cols-1 place-items-center">
          Loading...
        </div>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
