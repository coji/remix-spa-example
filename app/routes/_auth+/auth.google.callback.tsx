import { ClientLoaderFunctionArgs, redirect } from '@remix-run/react'
import { signIn } from '~/services/auth'
import { authenticate } from '~/services/google-auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const req = new Request(location.href)
  const idToken = await authenticate(req)
  const user = await signIn(idToken)
  if (user.handle) redirect(`/${user.handle}`)
  return redirect('/')
}

// clientLoader だけでは動かないのでダミーの route コンポーネント
export default function GoogleAuthCallbackPage() {
  return <div> </div>
}
