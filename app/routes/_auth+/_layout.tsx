import { Link, type MetaFunction, Outlet } from '@remix-run/react'
import { UserAvatarMenu } from '~/components/UserAvatarMenu'

export const meta: MetaFunction = () => {
  return [
    { title: 'しずかな Remix SPA Example' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export default function AppLayout() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <header className="flex p-2 border-b">
        <div className="flex gap-2 flex-1">
          <h1 className="text-2xl">
            <Link to="/">しずかな Remix SPA Example</Link>
          </h1>
        </div>
        <UserAvatarMenu />
      </header>

      <main className="px-2 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
