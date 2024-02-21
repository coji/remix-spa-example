import { Outlet, type MetaFunction } from '@remix-run/react'
import { AppUserMenu } from '~/components/AppUserMenu'

export const meta: MetaFunction = () => {
  return [
    { title: 'しずかな Remix SPA Example' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export default function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <header className="flex p-2">
        <div className="flex-1" />
        <AppUserMenu />
      </header>

      <main className="overflow-auto px-2">
        <Outlet />
      </main>
    </div>
  )
}
