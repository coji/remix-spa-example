import { ClientLoaderFunctionArgs, Link } from '@remix-run/react'
import { Button, Stack } from '~/components/ui'
import { useSignOut } from '~/routes/_auth+/sign_out'
import { requireAuth } from '~/services/auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await requireAuth(request, { failureRedirect: '/' })
  return null
}
export default function WelcomeIndexPage() {
  const { signOut } = useSignOut()

  return (
    <div className="px-4 py-32 max-w-sm w-full mx-auto flex flex-col justify-center items-center gap-8 leading-10">
      <div className="text-xl">アカウントを作成します</div>

      <Stack className="bg-slate-100 rounded-3xl p-6">
        <div className="text-slate-700">
          <Link className="underline" to="/license" target="_blank">
            利用規約
          </Link>
          と
          <Link className="underline" to="/privacy" target="_blank">
            プライバシーポリシー
          </Link>
          をご確認ください。
        </div>

        <Button variant="outline" size="lg" asChild>
          <Link to="/welcome/create_account" prefetch="render">
            同意する
          </Link>
        </Button>
      </Stack>

      <Button variant="link" onClick={() => signOut()}>
        アカウント作成をやめる
      </Button>
    </div>
  )
}
