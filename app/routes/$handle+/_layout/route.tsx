import { Outlet } from 'react-router'
import { AppFooter } from '~/components/AppFooter'
import { optionalAuthMiddleware } from '~/middlewares/optional-auth-middleware'

export const clientMiddleware = [optionalAuthMiddleware]

export default function UserPageLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <main>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  )
}
