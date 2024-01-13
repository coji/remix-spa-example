import { Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { signIn } from '~/services/auth'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  await authenticate({ successRedirect: '/app' })
  return null
}

export const clientAction = async () => {
  await signIn()
  return null
}

export default function SignInPage() {
  return (
    <Form method="POST">
      <Button>サインイン</Button>
    </Form>
  )
}
