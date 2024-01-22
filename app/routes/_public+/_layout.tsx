import { Link, Outlet, useLocation } from '@remix-run/react'
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
      <nav className="flex py-2 px-4">
        <div className="flex-1">しずかな Remix SPA Example</div>
        <div>
          {user ? (
            <Button variant="outline" className="rounded-full" asChild>
              <Link to={`/${user.handle}`}>自分のページへ</Link>
            </Button>
          ) : (
            <SignInModal />
          )}
        </div>
      </nav>

      <div className="grid grid-rows-[1fr_auto] min-h-screen">
        <main>
          <AppHeadingSection>
            <nav>
              <Tabs defaultValue={pathname.split('/').at(1)}>
                <TabsList>
                  <TabsTrigger value="license" asChild>
                    <Link to="/license">利用規約</Link>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" asChild>
                    <Link to="/privacy">プライバシーポリシー</Link>
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
