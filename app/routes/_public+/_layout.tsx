import { Link, Outlet, useLocation } from '@remix-run/react'
import { $path } from 'remix-routes'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Tabs, TabsList, TabsTrigger } from '~/components/ui'
import { SignInModal } from '~/routes/auth+/sign_in'
import { useAuthUser } from '~/services/auth'

export default function PublicPageLayout() {
  const { pathname } = useLocation()
  const user = useAuthUser()

  return (
    <div>
      <nav className="flex items-center px-4 py-2">
        <Link to={$path('/')} className="flex-1">
          しずかな Remix SPA Example
        </Link>
        <div>
          {user?.handle ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link to={$path('/:handle', { handle: user.handle })}>
                自分のページへ
              </Link>
            </Button>
          ) : (
            <SignInModal />
          )}
        </div>
      </nav>

      <div className="grid min-h-screen grid-rows-[1fr_auto]">
        <main>
          <AppHeadingSection>
            <nav>
              <Tabs defaultValue={pathname.split('/').at(1)}>
                <TabsList>
                  <TabsTrigger value="license" asChild>
                    <Link to={$path('/license')}>利用規約</Link>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" asChild>
                    <Link to={$path('/privacy')}>プライバシーポリシー</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>

            <div className="prose lg:prose-xl">
              <Outlet />
            </div>
          </AppHeadingSection>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
