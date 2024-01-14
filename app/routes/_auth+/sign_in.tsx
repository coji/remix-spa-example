import { Form, useNavigation } from '@remix-run/react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui'
import { signIn } from '~/services/auth'
import { authenticate } from '~/services/auth'

export const clientLoader = async () => {
  const user = await authenticate({ successRedirect: '/admin' })
  console.log({ user })
  return null
}

export const clientAction = async () => {
  await signIn()
  return null
}

export const SignInModal = () => {
  const navigation = useNavigation()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">はじめる</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>しずかな Remix SPA</DialogTitle>
          <DialogDescription>
            しずかな Remix SPA にサインインしてください。
          </DialogDescription>
        </DialogHeader>

        <Form method="POST" action="/sign_in">
          <Button className="w-full" disabled={navigation.state !== 'idle'}>
            {navigation.state === 'submitting'
              ? 'サインインしています...'
              : 'Google アカウントでサインイン'}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
