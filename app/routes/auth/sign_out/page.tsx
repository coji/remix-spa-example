import { Form, href, redirect, useFetcher } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui'
import { requireAuth, signOut } from '~/services/auth'
import type { Route } from './+types/page'

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  await requireAuth(request, { failureRedirect: href('/') })
  return null
}

export const clientAction = async () => {
  await signOut()
  toast.info('サインアウトしました', {
    description: 'またのご利用をお待ちしております。',
  })
  return redirect(href('/'))
}

export const useSignOut = () => {
  const fetcher = useFetcher()

  const signOut = () => {
    fetcher.submit({}, { method: 'POST', action: href('/auth/sign_out') })
  }

  return { signOut }
}

export default function SignOutPage() {
  return (
    <Form method="POST" action={href('/auth/sign_out')}>
      <Button>サインアウト</Button>
    </Form>
  )
}
