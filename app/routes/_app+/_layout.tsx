import { Link, type MetaFunction, Outlet } from '@remix-run/react'
import { useState } from 'react'
import { AppNavMenu, AppNavMenuButton } from '~/components/AppNavMenu'
import { UserAvatarMenu } from '~/components/UserAvatarMenu'
import { authenticate } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix SPA Example App' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export const clientLoader = async () => {
  await authenticate({ failureRedirect: '/sign_in' })
  return null
}

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <header className="flex p-2 border">
        <div className="flex gap-2 flex-1">
          <AppNavMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />

          <h1 className="text-2xl">
            <Link to="/app">Remix SPA Example</Link>
          </h1>
        </div>
        <UserAvatarMenu />
      </header>

      <div className="grid grid-cols-[auto_1fr]">
        <AppNavMenu isOpen={isMenuOpen} onClick={setIsMenuOpen} />

        <main className="px-2 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
