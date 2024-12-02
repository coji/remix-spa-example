import { Form, redirect, useFetcher } from 'react-router'
import { $path } from 'safe-routes'
import { Button, toast } from '~/components/ui'
import { requireAuth, signOut } from '~/services/auth'
import type { Route } from './+types/route'

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  await requireAuth(request, { failureRedirect: $path('/') })
  return null
}

export const clientAction = async () => {
  await signOut()
  toast({
    title: 'サインアウトしました',
    description: 'またのご利用をお待ちしております。',
  })
  return redirect($path('/'))
}

export const useSignOut = () => {
  const fetcher = useFetcher()

  const signOut = () => {
    fetcher.submit({}, { method: 'POST', action: $path('/auth/sign_out') })
  }

  return { signOut }
}

export default function SignOutPage() {
  return (
    <Form method="POST" action={$path('/auth/sign_out')}>
      <Button>サインアウト</Button>
    </Form>
  )
}
