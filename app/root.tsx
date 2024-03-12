import {
  Links,
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

export const Layout = ({ children }: { children: React.ReactNode }) => {
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
          {children}
        </AuthContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return (
    <p className="grid h-screen grid-cols-1 place-items-center">Loading...</p>
  )
}
