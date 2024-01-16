import { type MetaFunction, Outlet } from '@remix-run/react'
import { AppUserMenu } from '~/components/AppUserMenu'

export const meta: MetaFunction = () => {
  return [
    { title: 'しずかな Remix SPA Example' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export default function AppLayout() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <header className="flex p-2">
        <div className="flex-1" />
        <AppUserMenu />
      </header>

      <main className="px-2 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
