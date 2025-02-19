import { href, Link, redirect } from 'react-router'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Stack } from '~/components/ui'
import { useSignOut } from '~/routes/auth/sign_out/page'
import { requireAuth } from '~/services/auth'
import type { Route } from './+types/page'

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const user = await requireAuth(request, { failureRedirect: href('/') })
  if (user.handle) {
    return redirect(href('/:handle', { handle: user.handle }))
  }
  return null
}

export default function WelcomeIndexPage() {
  const { signOut } = useSignOut()

  return (
    <AppHeadingSection className="items-center">
      <div className="text-xl">アカウントを作成します</div>

      <Stack className="rounded-3xl bg-slate-100 p-6">
        <div className="text-slate-700">
          <Link className="underline" to={href('/license')} target="_blank">
            利用規約
          </Link>
          と
          <Link className="underline" to={href('/privacy')} target="_blank">
            プライバシーポリシー
          </Link>
          をご確認ください。
        </div>

        <Button variant="outline" size="lg" asChild>
          <Link to={href('/welcome/create_account')} prefetch="render">
            同意する
          </Link>
        </Button>
      </Stack>

      <Button variant="link" onClick={() => signOut()}>
        アカウント作成をやめる
      </Button>
    </AppHeadingSection>
  )
}
