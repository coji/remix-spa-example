import { Link, type MetaFunction, Outlet } from '@remix-run/react'
import { UserAvatarMenu } from '~/components/UserAvatarMenu'
import { authenticate, useAuthUser } from '~/services/auth'

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
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex p-2">
        <h1 className="text-2xl">
          <Link to="/app">Remix SPA Example</Link>
        </h1>
        <div className="flex-1" />
        <UserAvatarMenu />
      </header>

      <main className="px-2">
        <Outlet />
      </main>

      <footer className="text-center p-2">Copyright &copy; coji.</footer>
    </div>
  )
}
