import { href, redirect } from 'react-router'
import { toast } from 'sonner'
import { authenticateCallback } from '~/services/google-auth'

export const clientLoader = async () => {
  const request = new Request(location.href) // clientLoader の request には hash が含まれないのでここで作る
  const user = await authenticateCallback(request)
  if (user?.handle) {
    toast.info('サインインしました', {
      description: `${user.displayName} さん、ようこそ！`,
    })
    return redirect(href('/:handle', { handle: user.handle }))
  }
  return redirect(href('/'))
}

// clientLoader だけでは動かないのでダミーの route コンポーネント
export default function GoogleAuthCallbackPage() {
  return <div> </div>
}
