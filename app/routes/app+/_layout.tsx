import { Link, type MetaFunction, Outlet } from '@remix-run/react'
import { AppUserProfile } from '~/components/AppUserProfile'
import { requireUser, useAuthUser } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix SPA Example App' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export const clientLoader = async () => {
  const user = await requireUser({ failureRedirect: '/sign_in' })
  return user
}

export default function AppLayout() {
  const user = useAuthUser()

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex p-2">
        <h1 className="text-2xl">
          <Link to="/app">Remix SPA Example</Link>
        </h1>
        <div className="flex-1" />
        <AppUserProfile />
      </header>

      <main className="px-2">
        <Outlet />
      </main>

      <footer className="text-center p-2">Copyright &copy; coji.</footer>
    </div>
  )
}
