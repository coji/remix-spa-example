import { ClientActionFunctionArgs, Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { signIn } from '~/services/auth'

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await signIn()
}

export default function SignInPage() {
  return (
    <Form method="POST">
      <Button>サインイン</Button>
    </Form>
  )
}
