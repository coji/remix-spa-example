import { ClientLoaderFunctionArgs, redirect } from '@remix-run/react'
import { signIn } from '~/services/auth'
import { authenticate } from '~/services/google-auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const req = new Request(location.href) // clientLoader の request には hash が含まれないのでここで作る
  const idToken = await authenticate(req)
  const user = await signIn(request, idToken)
  if (user.handle) {
    return redirect(`/${user.handle}`)
  }
  return redirect('/')
}

// clientLoader だけでは動かないのでダミーの route コンポーネント
export default function GoogleAuthCallbackPage() {
  return <div> </div>
}
