import { ClientActionFunctionArgs, Form, redirect } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { signOut } from '~/services/auth'

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await signOut()
  return redirect('/')
}

export default function SignOutPage() {
  return (
    <Form method="POST">
      <Button>サインアウト</Button>
    </Form>
  )
}
