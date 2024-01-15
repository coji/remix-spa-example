import {
  ClientActionFunctionArgs,
  Form,
  redirect,
  useFetcher,
} from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { signOut } from '~/services/auth'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  await authenticate({ failureRedirect: '/' })
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await signOut()
  return redirect('/')
}

export const useSignOut = () => {
  const fetcher = useFetcher()

  const signOut = () => {
    fetcher.submit({}, { method: 'POST', action: '/sign_out' })
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
