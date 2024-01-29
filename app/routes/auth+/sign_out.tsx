import {
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useFetcher,
} from '@remix-run/react'
import { Button, toast } from '~/components/ui'
import { requireAuth, signOut } from '~/services/auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await requireAuth(request, { failureRedirect: '/' })
  return null
}

export const clientAction = async () => {
  await signOut()
  toast({
    title: 'サインアウトしました',
    description: 'またのご利用をお待ちしております。',
  })
  return redirect('/')
}

export const useSignOut = () => {
  const fetcher = useFetcher()

  const signOut = () => {
    fetcher.submit({}, { method: 'POST', action: '/auth/sign_out' })
  }

  return { signOut }
}

export default function SignOutPage() {
  return (
    <Form method="POST">
      <Button>サインアウト</Button>
    </Form>
  )
}
