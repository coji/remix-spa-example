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
  console.log('hoge')
  return { name: 'root' }
}

export default function App() {
  const { authState } = useAuthStateObserve()
  console.log('App', { authState })
  return (
    <html lang="en">
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
        <p>Loading...</p>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
