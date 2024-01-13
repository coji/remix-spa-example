import { type MetaFunction, Outlet } from '@remix-run/react'
import { AppUserProfile } from '~/components/AppUserProfile'
import { useAuthUser } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix SPA Example' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}
export default function AppLayout() {
  const user = useAuthUser()
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex p-2">
        <h1 className="text-2xl">Remix SPA Example</h1>
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
