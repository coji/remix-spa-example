import { Outlet, Scripts } from '@remix-run/react'
import { Toaster } from '~/components/ui'
import { AuthContext, useAuthStateObserve } from './services/auth'
import './styles/globals.css'

export const meta = () => {
  return [{ title: 'しずかな Remix SPA Example' }]
}

export default function App() {
  const { authState } = useAuthStateObserve()
  return (
    <>
      <AuthContext.Provider value={authState}>
        <Toaster />
        <Outlet />
      </AuthContext.Provider>
      <Scripts />
    </>
  )
}

export function HydrateFallback() {
  return (
    <>
      <div className="grid h-screen grid-cols-1 place-items-center">
        Loading...
      </div>
      <Scripts />
    </>
  )
}
