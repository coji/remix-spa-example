import { Button, Input } from '~/components/ui'
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

      <div>
        <div className="p-2 bg-white" />
        <Input name="name" />
      </div>

      <div className="text-center">
        <Button variant="link" onClick={() => signOut()}>
          アカウント作成をやめる
        </Button>
      </div>
    </div>
  )
}
