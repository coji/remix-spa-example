import { Outlet } from '@remix-run/react'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'

export default function PublicPageLayout() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen">
      <main>
        <AppHeadingSection>
          <div className="prose lg:prose-xl">
            <Outlet />
          </div>
        </AppHeadingSection>
      </main>

      <AppFooter />
    </div>
  )
}
