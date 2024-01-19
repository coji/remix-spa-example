import {
  ClientLoaderFunctionArgs,
  Link,
  type MetaFunction,
  Outlet,
} from '@remix-run/react'
import { useState } from 'react'
import { AppNavMenu, AppNavMenuButton } from '~/components/AppNavMenu'
import { AppUserMenu } from '~/components/AppUserMenu'
import { requireAuth } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin - しずかな Remix SPA Example' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await requireAuth(request, { failureRedirect: '/' })
  return null
}

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <header className="flex p-2 border-b">
        <div className="flex gap-2 flex-1">
          <AppNavMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />

          <h1 className="text-2xl">
            <Link to="/admin">Admin - しずかな Remix SPA Example</Link>
          </h1>
        </div>
        <AppUserMenu />
      </header>

      <div className="grid grid-cols-[auto_1fr] overflow-auto">
        <AppNavMenu isOpen={isMenuOpen} onClick={setIsMenuOpen} />

        <main className="px-2 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}