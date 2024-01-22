import { Outlet } from '@remix-run/react'
import { AppFooter } from '~/components/AppFooter'

export default function UserPageLayout() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen">
      <main>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  )
}
