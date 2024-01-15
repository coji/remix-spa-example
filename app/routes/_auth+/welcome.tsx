import { Link } from '@remix-run/react'
import { Button } from '~/components/ui'
import { useSignOut } from '~/routes/_auth+/sign_out'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  await authenticate({ failureRedirect: '/' })
  return null
}
export default function RegisterProfilePage() {
  const { signOut } = useSignOut()

  return (
    <div className="px-4 py-32 max-w-lg w-full mx-auto flex flex-col justify-center items-center gap-8 leading-10">
      <div className="text-xl">アカウントを作成します</div>

      <div className="bg-slate-50 rounded-md flex flex-col gap-4 p-4">
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

        <div className="text-center mx-auto">
          <Button variant="outline" asChild>
            <Link to="/account/create">同意する</Link>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button variant="link" onClick={() => signOut()}>
          アカウント作成をやめる
        </Button>
      </div>
    </div>
  )
}
