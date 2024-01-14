import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { AuthContext, useAuthStateObserve } from './services/auth'
import './styles/globals.css'

export const clientLoader = async () => {
  return { name: 'root' }
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
        {/* <Links /> */}
      </head>
      <body>
        <div className="grid grid-cols-1 h-screen place-items-center">
          Loading...
        </div>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
