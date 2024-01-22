import { redirect } from '@remix-run/react'
import { authenticateCallback } from '~/services/google-auth'

export const clientLoader = async () => {
  const request = new Request(location.href) // clientLoader の request には hash が含まれないのでここで作る
  const user = await authenticateCallback(request)
  if (user?.handle) {
    return redirect(`/${user.handle}`)
  }
  return redirect('/')
}

// clientLoader だけでは動かないのでダミーの route コンポーネント
export default function GoogleAuthCallbackPage() {
  return <div> </div>
}
